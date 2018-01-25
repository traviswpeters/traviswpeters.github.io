#include <pebble.h>
#include "code.h"
#include "pebble_strtok.h"

/*
 * User Interface
 */

// High-level UI components
static Window *s_main_window;
static TextLayer *s_title_layer;
static TextLayer *s_connection_status_title_layer;
static TextLayer *s_bt_connection_status_title_layer;
static TextLayer *s_connection_status_layer;
static TextLayer *s_bt_connection_status_layer;
static TextLayer *s_hexcode_layer;
static TextLayer *s_status_layer;

char *start_msg_str = "'Select' 2 Mark Drops";

// Global UI buffers
const int status_str_len = 23; 
static char status_str[23];

const int formatted_code_msg_len = 400; 
static char formatted_code_msg[400];

const int s_connection_status_buf_len = 23; 
static char s_connection_status_buf[23];

// Connection status strings.
char *bt_connected_str = "connected"; //"bt-connected";
char *bt_notconnected_str = "disconnected"; //"bt-disconnected";
char *server_connected_str = "connected!"; //"server-connected!";
char *server_notconnected_str = "disconnected!"; //"server-not-connected!";

char *connected_str = "sent connect!";
char *disconnected_str = "sent disconnect!";

/*
 * Bluetooth Communications (AppMessage)
 */

// State variable indicating if the JS environment (smartphone) is up and running.
static bool s_js_ready;

// Static variable indicating the state of the connection with the server.
static bool s_server_connected; 

// Static variable indicating the state of the bluetooth connection.
static bool s_bt_connected; 

// Timer for handling Bluetooth communication retries.
static AppTimer *s_timeout_timer;

// Cached data (needed if we have to retry sending any failed communications)
static int last_key;
static size_t last_buf_total_size = 400; 
static char last_buf[400]; 
static size_t last_buf_size; 

static int retries = 0;
const int short_retry_interval_ms = 1000;  // 1 sec
const int medium_retry_interval_ms = 5000; // 3 sec
const int long_retry_interval_ms = 8000;   // 5 sec

// Prototypes
static void send_str(int key, const char * const value, size_t size);
static void bluetooth_callback(bool connected);

/*
 * Misc. 
 */

// Declare character array buffer pointer to hold the Pebble ID.
static char *pebble_id;

// Random codes
const int code_len = 4;
const char *hexcodes = "0123456789ABCDEF";

/************************************ utility *********************************/

/*
 * Helper routine for checking the status of our ability to communicate with 
 * the JS environment on the smartphone.
 */
bool comm_is_js_ready() {
  return s_js_ready; 
}

bool is_bt_connected() {
  return s_bt_connected;
}

bool is_server_connected() {
  return s_server_connected;
}

/*
 * Generate a new random HEX code of length 4. Pebble doesn't seem to like me 
 * using a variable in place of the "4" so we have to deal with this magic 
 * number for now...
 */
char * gen_new_rand_code() {
  // Clear the static buffer. 
  static char code_buf[5];
  memset(code_buf, 0, 5);

  // Generate the random code. 
  for(int i = 0; i < code_len; i++) {
    code_buf[i] = hexcodes[rand() % 16];
  }
  // LOG("gen_new_rand_code=%s", code_buf);
  return code_buf;
}

/*
 * Set the app's internal variable holding its notion of its pebble_id.
 */
void set_pebble_id(char *pebble_id_str) {
  // Cache the PebbleID!
  int length = strlen(pebble_id_str);

  // Free any previous data
  if(pebble_id != NULL) {
    free(pebble_id);
  }

  pebble_id = (char*)malloc(length * sizeof(char));
  if (pebble_id != NULL) {
    strcpy(pebble_id, pebble_id_str);    
  }
}

/*
 * Given an AppMessageResult code, get a text description for the result.
 *
 * The `pebble analyze-size` command was used to measure the memory impact. This 
 * function will "cost" an extra ~228 bytes of program memory.
 *
 * Source: http://stackoverflow.com/questions/21150193/logging-enums-on-the-pebble-watch
 *    Ex.: https://github.com/sarfata/pbsat/blob/master/src/comm.c
 *
 * Example: If you define a callback that handles AppMessageResult, you can 
 * easily convert the AppMessageResult (int) into a text string with this 
 * routine (where 'reason' is of type AppMessageREsult:
 *
 *                        translate_error(reason); 
 *
 * @param result A numeric code indicating the result of a recent communication.
 */
char *translate_error(AppMessageResult result) {
  switch (result) {
    case APP_MSG_OK: return "APP_MSG_OK";
    case APP_MSG_SEND_TIMEOUT: return "APP_MSG_SEND_TIMEOUT";
    case APP_MSG_SEND_REJECTED: return "APP_MSG_SEND_REJECTED";
    case APP_MSG_NOT_CONNECTED: return "APP_MSG_NOT_CONNECTED";
    case APP_MSG_APP_NOT_RUNNING: return "APP_MSG_APP_NOT_RUNNING";
    case APP_MSG_INVALID_ARGS: return "APP_MSG_INVALID_ARGS";
    case APP_MSG_BUSY: return "APP_MSG_BUSY";
    case APP_MSG_BUFFER_OVERFLOW: return "APP_MSG_BUFFER_OVERFLOW";
    case APP_MSG_ALREADY_RELEASED: return "APP_MSG_ALREADY_RELEASED";
    case APP_MSG_CALLBACK_ALREADY_REGISTERED: return "APP_MSG_CALLBACK_ALREADY_REGISTERED";
    case APP_MSG_CALLBACK_NOT_REGISTERED: return "APP_MSG_CALLBACK_NOT_REGISTERED";
    case APP_MSG_OUT_OF_MEMORY: return "APP_MSG_OUT_OF_MEMORY";
    case APP_MSG_CLOSED: return "APP_MSG_CLOSED";
    case APP_MSG_INTERNAL_ERROR: return "APP_MSG_INTERNAL_ERROR";
    case APP_MSG_INVALID_STATE: return "APP_MSG_INVALID_STATE";
    default: return "UNKNOWN ERROR";
  }
}

/*
 * Helper routine to store the value that should be retried in the event of 
 * a failed communication. 
 */
static void set_last(int key, const char * const value, size_t size, bool clear_first) {
  // clear the buffer. 
  if (clear_first) {
    memset(last_buf, 0, last_buf_total_size);    
  }

  // Retain values in the event that we have to perform a re-send. 
  last_key = key; 
  last_buf_size = size; 
  memcpy(last_buf, value, last_buf_size);
}

/*
 * A timeout handler for retrying any failed Bluetooth communications.
 */
static void timeout_timer_handler(void *context) {
  // The timer elapsed because no success was reported
  text_layer_set_text(s_status_layer, "Failed. Retrying...");
  retries++;

  // Retry the message
  if (retries < 10) {
    send_str(last_key, last_buf, last_buf_size);
  } else {
    LOG_ERROR("Dropping message after %i retries: %s", retries, last_buf);
  }
}

/*
 * A busy timeout handler for retrying a Bluetooth communication that could not 
 * take place due to pending data in the inbox/outbox.
 */
static void busy_timer_handler(void *context) {
  text_layer_set_text(s_status_layer, "Busy. Retrying...");
  retries++;

  // Retry the message
  if (retries < 10) {
    send_str(last_key, last_buf, last_buf_size);
  } else {
    LOG_ERROR("Dropping message after %i retries: %s", retries, last_buf);
  }
}

/*
 * Send a message (String) to the smartphone over Bluetooth 
 * (if the JS environment is ready). 
 */
static void send_str(int key, const char * const value, size_t size) {

  // Cache data just in case we have to retry later...
  if (retries == 0) {
    // Clear the buffer before caching a 'new' message.
    set_last(key, value, size, true); 
  }

  if (comm_is_js_ready()) {
    // Provide some feedback about the state of communication...
    snprintf(status_str, sizeof(status_str), "Sending... (%i)", retries);
    text_layer_set_text(s_status_layer, status_str);

    // Declare the dictionary's iterator
    DictionaryIterator *iter;

    // Prepare the outbox buffer for this message
    AppMessageResult result = app_message_outbox_begin(&iter);

    if(result == APP_MSG_OK) {
      // Construct the message.
      dict_write_cstring(iter, key, value);

      // Send this message
      result = app_message_outbox_send();
      if(result != APP_MSG_OK) {
        LOG_ERROR("Error sending the outbox: (%i) %s", (int)result, translate_error((int)result));
      } else {
        // *** Schedule the timeout timer ***
        s_timeout_timer = app_timer_register(short_retry_interval_ms, timeout_timer_handler, NULL);
      }
    } else {
      // The outbox cannot be used right now
      LOG_ERROR("Error preparing the outbox: (%i) %s", (int)result, translate_error((int)result));

      // *** Schedule the busy wait timer ***
      s_timeout_timer = app_timer_register(medium_retry_interval_ms, busy_timer_handler, NULL);
    }
  } else {
    // Provide some feedback about the state of communication...
    LOG_ERROR("error: js environment not ready.");
    snprintf(status_str, sizeof(status_str), "js env not ready");
    text_layer_set_text(s_status_layer, status_str);
  }
}

/******************************* main_window_load *****************************/

static void main_window_load(Window *window) {
  // Get information about the Window
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  // app title layer
  s_title_layer = text_layer_create(GRect(0, 5, bounds.size.w, 20));
  text_layer_set_text(s_title_layer, "Code Drop");
  text_layer_set_text_alignment(s_title_layer, GTextAlignmentCenter);

  //
  // status of filewriter
  //

  // (title layer) status of connection with filewriter server
  s_connection_status_title_layer = text_layer_create(GRect(0, 30, bounds.size.w, 20));
  text_layer_set_text(s_connection_status_title_layer, "Server Status:");
  text_layer_set_text_alignment(s_connection_status_title_layer, GTextAlignmentCenter);

  // status of connection with filewriter server
  s_connection_status_layer = text_layer_create(GRect(0, 45, bounds.size.w, 20));
  text_layer_set_text(s_connection_status_layer, server_notconnected_str);
  text_layer_set_text_alignment(s_connection_status_layer, GTextAlignmentCenter);
  s_server_connected = false;

  //
  // status of bluetooth
  //

  s_bt_connection_status_title_layer = text_layer_create(GRect(0, 65, bounds.size.w, 20));
  text_layer_set_text(s_bt_connection_status_title_layer, "BT Status:");
  text_layer_set_text_alignment(s_bt_connection_status_title_layer, GTextAlignmentCenter);

  s_bt_connection_status_layer = text_layer_create(GRect(0, 80, bounds.size.w, 20));
  text_layer_set_text(s_bt_connection_status_layer, bt_notconnected_str);
  text_layer_set_text_alignment(s_bt_connection_status_layer, GTextAlignmentCenter);
  s_bt_connected = false;

  //
  // Hex code and status (response) layers
  //

  // hex code layer
  s_hexcode_layer = text_layer_create(GRect(0, 95, bounds.size.w, 45));
  text_layer_set_text(s_hexcode_layer, "CODE");
  text_layer_set_font(s_hexcode_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));
  text_layer_set_text_alignment(s_hexcode_layer, GTextAlignmentCenter);

  // status layer
  s_status_layer = text_layer_create(GRect(0, 145, bounds.size.w, 20));
  text_layer_set_text(s_status_layer, start_msg_str);
  text_layer_set_text_alignment(s_status_layer, GTextAlignmentCenter);

  // Show the correct state of the BT connection from the start
  bluetooth_callback(connection_service_peek_pebble_app_connection());

  // Add the layers to the window.
  layer_add_child(window_layer, text_layer_get_layer(s_title_layer));
  layer_add_child(window_layer, text_layer_get_layer(s_connection_status_title_layer));
  layer_add_child(window_layer, text_layer_get_layer(s_bt_connection_status_title_layer));
  layer_add_child(window_layer, text_layer_get_layer(s_connection_status_layer));
  layer_add_child(window_layer, text_layer_get_layer(s_bt_connection_status_layer));
  layer_add_child(window_layer, text_layer_get_layer(s_hexcode_layer));
  layer_add_child(window_layer, text_layer_get_layer(s_status_layer));
}

/****************************** main_window_unload ****************************/

static void main_window_unload(Window *window) {
  // Destroy TextLayer
  text_layer_destroy(s_title_layer);
  text_layer_destroy(s_connection_status_title_layer);
  text_layer_destroy(s_bt_connection_status_title_layer);
  text_layer_destroy(s_connection_status_layer);
  text_layer_destroy(s_bt_connection_status_layer);
  text_layer_destroy(s_hexcode_layer);
  text_layer_destroy(s_status_layer);
}

/******************************* app message code *****************************/

/*
 * When the watch receives an AppMessage message from the JS part of the 
 * watchface, this callback will be called and we will be provided a dictionary 
 * of data in the form of a DictionaryIterator object, as seen in the callback 
 * signature.
 */
static void inbox_received_handler(DictionaryIterator *iterator, void *context) {
  char *prefix = "inbox-rx:";

  // Check: Is PebbleKit JS ready?! If so, then it is safe to send messages!
  // --> NOTE: The AppJS env. sends the pebble ID with its startup message.
  Tuple *ready_tuple = dict_find(iterator, AppKeyJSReady);
  if(ready_tuple) {
    s_js_ready = true;
    char *ready_str = ready_tuple->value->cstring;
    set_pebble_id(ready_str);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "%s AppKeyJSReady: %s", prefix, ready_str);
  }

  // Check: Got a textual message (from a server?)! Parse string...
  Tuple *recvmsg_tuple = dict_find(iterator, AppKeyRecvMsg);
  if(recvmsg_tuple) {
    char *recvmsg_str = recvmsg_tuple->value->cstring;
    APP_LOG(APP_LOG_LEVEL_DEBUG, "%s AppKeyRecvMsg: %s", prefix, recvmsg_str);

    // Handle ACK - show user that their code drop was ACK-ed by the server. 
    const char delim[2] = " ";
    char *token1 = pebble_strtok(recvmsg_str, delim);
    if (strncmp(token1, "ACK", 3) == 0) {
      char *token2 = pebble_strtok(NULL, delim);

      // Update display with ACK
      // static char status_str[10]; 
      memset(status_str, 0, 20);
      snprintf(status_str, sizeof(status_str), "%s %s", token1, token2);
      text_layer_set_text(s_status_layer, status_str);
    }
  }

  // Check: Got a location update.
  Tuple *location_tuple = dict_find(iterator, AppKeyLocation);
  if(location_tuple) {
    char *lat_long_str = location_tuple->value->cstring;
    // APP_LOG(APP_LOG_LEVEL_DEBUG, "%s AppKeyLocation: %s", prefix, lat_long_str);

    // Update display
    char *new_rand_code = gen_new_rand_code();
    text_layer_set_text(s_hexcode_layer, new_rand_code);

    // Build formatted string and send!
    // static char formatted_code_msg[200];
    int len = strlen(pebble_id)+1+strlen(lat_long_str)+2+strlen(new_rand_code)+1; 
    memset(formatted_code_msg, 0, 400);
    // snprintf(formatted_code_msg, sizeof(formatted_code_msg), "%s %s, %s", pebble_id, lat_long_str, new_rand_code);
    snprintf(formatted_code_msg, len, "%s %s, %s", pebble_id, lat_long_str, new_rand_code);

    // LOG_ERROR("%s", formatted_code_msg);
    LOG("%s AppKeyLocation: %s", prefix, formatted_code_msg);
    send_str(AppKeySendMsg, formatted_code_msg, strlen(formatted_code_msg));
  }

  // Check: In case it has changed (?), updated the pebble_id on this event.
  Tuple *pebble_id_tuple = dict_find(iterator, AppKeyPebbleId);
  if(pebble_id_tuple) {
    char *pebble_id_str = pebble_id_tuple->value->cstring;
    set_pebble_id(pebble_id_str);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "%s AppKeyPebbleId: %s", prefix, pebble_id_str);
  }

  // Check: Uh oh, my companion app can't connect to the remote server...
  // -> Are my configurations in `appinfo.json` correct?
  Tuple *senderr_tuple = dict_find(iterator, AppKeySendError);
  if(senderr_tuple) {
    char *err_str = senderr_tuple->value->cstring;
    APP_LOG(APP_LOG_LEVEL_ERROR, "%s AppKeySendError: %s", prefix, err_str);

    // TODO: do I need to retry the connection? or is my companion going to handle that?!
    //....
    text_layer_set_text(s_status_layer, "Send Failed");
  }

  // NEW: display server connection status as reported from the companion app.
  Tuple *connstatus_tuple = dict_find(iterator, AppKeyConnStatusChange);
  if(connstatus_tuple) {
    // Log it
    char *connstatus_str = connstatus_tuple->value->cstring;
    APP_LOG(APP_LOG_LEVEL_ERROR, "%s AppKeyConnStatusChange: %s", prefix, connstatus_str);

    // Update internal variable for status
    if (strncmp(connstatus_str, server_connected_str, strlen(server_connected_str)) != 0) {
      s_server_connected = false;
    } else {
      s_server_connected = true;
    }

    // Copy value to static buffer for long-term retention only if the status has changed.
    // static char s_connection_status_buf[20];
    if (strncmp(s_connection_status_buf, connstatus_str, strlen(connstatus_str)) != 0) {
      // update!
      memset(s_connection_status_buf, 0, s_connection_status_buf_len);
      snprintf(s_connection_status_buf, strlen(connstatus_str), "%s", connstatus_str);
      text_layer_set_text(s_connection_status_layer, s_connection_status_buf);
      APP_LOG(APP_LOG_LEVEL_ERROR, " --> changed! %s", s_connection_status_buf);

      /*
       * Issue a vibrating alert  
       *
       * NOTE: If this code is commented out, the pebble will vibrate anytime the 
       * status of the connection with the server changes...
       */
      if(!s_server_connected) {
        vibes_double_pulse();
      }
    }
  }
}

static void inbox_dropped_callback(AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "inbox message dropped: (%i) %s", reason, translate_error(reason));
}

static void outbox_sent_callback(DictionaryIterator *iterator, void *context) {
  // Special cases for updating the s_status_layer.
  if (last_key == AppKeyServerConnect) {
    text_layer_set_text(s_status_layer, connected_str);
  } else if (last_key == AppKeyServerDisconnect) {
    text_layer_set_text(s_status_layer, disconnected_str);
  }

  // text_layer_set_text(s_status_layer, "Sent!");
  APP_LOG(APP_LOG_LEVEL_DEBUG, "outbox send success! LAST: (%d) %s", last_key, last_buf);

  // Successful message, the timeout is not needed anymore for this message.
  app_timer_cancel(s_timeout_timer);
  retries = 0;
}

static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "outbox send failed: (%i) %s", reason, translate_error(reason));

  // Message failed before timer elapsed, reschedule for later
  if(s_timeout_timer) {
    app_timer_cancel(s_timeout_timer);
  }

  // Inform the user of the failure
  text_layer_set_text(s_status_layer, "Failed. Retrying...*");

  // Use the timeout handler to perform the same action - resend the message
  app_timer_register(long_retry_interval_ms, timeout_timer_handler, NULL);
}

// The Bluetooth connection status callback.
static void bluetooth_callback(bool connected) {
  s_bt_connected = connected;

  // Log and show user
  char *bt_status = (connected ? bt_connected_str : bt_notconnected_str);
  LOG_ERROR("bt-connection-status: %s", bt_status);
  text_layer_set_text(s_bt_connection_status_layer, bt_status);

  if(!s_bt_connected) {
    // Issue a vibrating alert
    vibes_double_pulse();

    // TODO: If BT is not connected, we are certainly *not* connected to the server...
    // s_server_connected = false; 
    // LOG_ERROR("server-connection-status: %s", server_notconnected_str);
    // text_layer_set_text(s_connection_status_layer, server_notconnected_str);
  }
}

/******************************** button handlers *****************************/

static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
  // Does nothing right now...
  // text_layer_set_text(s_status_layer, "'Select' 2 Mark Drops");
  text_layer_set_text(s_status_layer, "send connect...");
  char *msg = "connect!\0";
  send_str(AppKeyServerConnect, msg, strlen(msg));
}

static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
  char *msg = "GET-LOCATION\0";
  send_str(AppKeyLocation, msg, strlen(msg));
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
  // Does nothing right now...
  // text_layer_set_text(s_status_layer, "'Select' 2 Mark Drops");
  text_layer_set_text(s_status_layer, "send disconnect...");
  char *msg = "disconnect!\0";
  send_str(AppKeyServerDisconnect, msg, strlen(msg));
}

// static void back_click_handler(ClickRecognizerRef recognizer, void *context) {
//   text_layer_set_text(text_layer, "Back");
// }

static void click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
  window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
 //window_single_click_subscribe(BUTTON_ID_BACK, back_click_handler);
}

/************************************* init ***********************************/

static void init() {
  // Create main Window element and assign to pointer
  s_main_window = window_create();

  // Window click event handlers
  window_set_click_config_provider(s_main_window, click_config_provider);

  // Set handlers to manage the elements inside the Window
  window_set_window_handlers(s_main_window, (WindowHandlers) {
    .load = main_window_load,
    .unload = main_window_unload
  });

  // Show the Window on the watch, with animated=true
  window_stack_push(s_main_window, true);

  /*
   * NOTE: It is considered best practice to register callbacks before opening 
   * AppMessage to ensure that no messages are missed (see below).
   */

  // Register communication callbacks
  app_message_register_inbox_received(inbox_received_handler);
  app_message_register_inbox_dropped(inbox_dropped_callback);
  app_message_register_outbox_failed(outbox_failed_callback);
  app_message_register_outbox_sent(outbox_sent_callback);

  // Open AppMessage - To always get the largest buffer available, follow this best practice:
  const int inbox_size = app_message_inbox_size_maximum();
  const int outbox_size = app_message_outbox_size_maximum();
  app_message_open(inbox_size, outbox_size);
  APP_LOG(APP_LOG_LEVEL_DEBUG, "inbox size = %d & outbox size = %d", inbox_size, outbox_size);

  // Register for Bluetooth connection updates
  connection_service_subscribe((ConnectionHandlers) {
    .pebble_app_connection_handler = bluetooth_callback
  });

}

/*********************************** deinit ***********************************/

static void deinit() {
  // Destroy Window
  window_destroy(s_main_window);

  char *msg = "FINISH"; 
  send_str(AppKeyPebbleFinished, msg, sizeof(msg)); 

  // Unregister AppMessage callbacks
  app_message_deregister_callbacks();

  // Unsubscribe from Bluetooth connection status info. 
  connection_service_unsubscribe();
}

/************************************* main ***********************************/


int main(void) {
  init();
  LOG("Done initializing");
  app_event_loop();
  deinit();
  LOG("Done deinitializing");
}