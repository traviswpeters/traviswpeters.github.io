/* -------------------------------------------------------------------------- *
 *  Globals
 * -------------------------------------------------------------------------- */

// Load the app configuration data.
var appinfo = require('./appinfo.js');

// A unique ID for this pebble/app.
var PEBBLE_DEVICE_ID;

// The URI endpoint for the WebSocket connection & the WebSocket object.
var wsUri;
var host; 
var port; 

var websocket;
var wsConnStatus;

var server_connected_str = "connected!"; //"server-connected!";
var server_notconnected_str = "disconnected!"; //"server-not-connected!";

/* -------------------------------------------------------------------------- *
 *  Utility functions.
 * -------------------------------------------------------------------------- */

// INFO, DEBUG, ERROR, WEBSOCKET(-RX,-TX,-ERROR), BT(-RX,-TX,-ERROR)
function log(prefix, message) {
   if (appinfo.config['appjsDebug'] || prefix !== 'DEBUG') {
    console.log(prefix + ': ' + message);
   }
}

/* -------------------------------------------------------------------------- *
 *  Location handlers.
 * -------------------------------------------------------------------------- */

/*
 * Handle a successful retrieval of location information.
 */
function locationSuccess(pos) {
  //log('DEBUG', 'Success requesting location!' + ' (' + pos.coords.latitude + ',' + pos.coords.longitude + ')');
  var formattedLocationMsg = pos.coords.latitude + ', ' + pos.coords.longitude; 
  sendStringToPebble('AppKeyLocation', formattedLocationMsg);
}

/*
 * Handle an unsuccessful retrieval of location information.
 */
function locationError(err) {
  if(err.code == err.PERMISSION_DENIED) {
    log('ERROR', 'Location access was denied by the user.');  
  } else {
    log('ERROR', 'Location error (' + err.code + '): ' + err.message);
  }
}

/*
 * Explicitly request the user's location data (as determined by smartphone GPS).
 */
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationError,
    {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000}
  );
}

/* -------------------------------------------------------------------------- *
 *  ReconnectingWebSocket. Modified from:
 *  https://gist.githubusercontent.com/trevordixon/7239401/raw/f127a032de9039d7b8c48b524aa561c50e7a4033/ReconnectingWebSocket.js
 * -------------------------------------------------------------------------- */

// MIT License:
//
// Copyright (c) 2010-2012, Joe Walnes
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * This behaves like a WebSocket in every way, except if it fails to connect,
 * or it gets disconnected, it will repeatedly poll until it succesfully connects
 * again.
 *
 * It is API compatible, so when you have:
 *   ws = new WebSocket('ws://....');
 * you can replace with:
 *   ws = new ReconnectingWebSocket('ws://....');
 *
 * The event stream will typically look like:
 *  onconnecting
 *  onopen
 *  onmessage
 *  onmessage
 *  onclose // lost connection
 *  onconnecting
 *  onopen  // sometime later...
 *  onmessage
 *  onmessage
 *  etc... 
 *
 * It is API compatible with the standard WebSocket API.
 *
 * Latest version: https://github.com/joewalnes/reconnecting-websocket/
 * - Joe Walnes
 * 
 * --------------------------------------------------------------------------
 *
 * Adding better state-aware code.
 *
 * The implementation was not as robust as it could have been because it 
 * assumed that the connection was successfully created, then dropped. 
 * This modified implementation makes no such assumption and attempts to 
 * setup the connection until it is successful, *and* reconnect if the 
 * connection breaks. 
 *
 * - Travis Peters, May 2016
 */

// var WebSocket = require('ws');

// Info extracted from WebSocket.js
const CONNECTING = 0;
const OPEN = 1; 
const CLOSING = 2;
const CLOSED = 3;

function ReconnectingWebSocket(url, protocols) {
    protocols = protocols || [];

    // These can be altered by calling code.
    this.debug = false;
    this.reconnectInterval = 3000;
    this.timeoutInterval = 3000;

    var self = this;
    var ws;
    var forcedClose = false;
    var timedOut = false;
    
    this.url = url;
    this.protocols = protocols;
    this.readyState = CONNECTING;
    this.URL = url; // Public API

    this.connectionStates = 
      [ "CONNECTING", "OPEN", "CLOSING", "CLOSED" ];

    this.getstate = function() {
      return this.readyState; 
    }

    this.getstatestr = function() {
      return this.connectionStates[this.readyState];
    }

    this.getstatestrsimple = function() {
      if (websocket && (websocket.getstate() === OPEN)) {
        return server_connected_str; 
      } else {
        return server_notconnected_str;
      }
    }

    // e.g. this.setstate(OPEN);
    this.setstate = function(state) {
      console.log('changing state from ' + this.connectionStates[this.readyState] + ' to ' + this.connectionStates[state]);
      this.readyState = state; 

      // Notify the Pebble of the connection state change.
      sendStringToPebble('AppKeyConnStatusChange', this.getstatestrsimple());
    }

    this.onopen = function(event) {
        console.log('connected.');
    };

    this.onclose = function(event) {
        console.log('disconnected.');
    };

    this.onconnecting = function(event) {
      if (self.debug || ReconnectingWebSocket.debugAll) {
          console.log('ReconnectingWebSocket', 'attempt-connect', url + '...');
      }
    };

    this.onmessage = function(event) {
      // custom onmessage handling...
      // this.send(event.data);
      sendStringToPebble('AppKeyRecvMsg', event.data);
    };

    this.onerror = function(event) {
      // custom onerror handling...
    };

    function connect(reconnectAttempt) {
        // ws = new WebSocket(url, protocols);
        ws = new WebSocket(url);

        // console.log('\nconnect( reconnectAttempt='+reconnectAttempt+' )');
        console.log('\nconnect( reconnectAttempt='+reconnectAttempt+' ) -- ' + JSON.stringify(ws));
        self.onconnecting();
        
        var localWs = ws;
        var timeout = setTimeout(function() {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.log('ReconnectingWebSocket', 'connection-timeout', url);
            }
            timedOut = true;
            localWs.close(); // TODO: BUG! This should be triggering ws.onclose() to initiate a reconnect attempt...
            timedOut = false;
            connect(true);   // HACK (see above) -- need to manually trigger a call to connect since localWs.close() isn't doing it for some reason...
        }, self.timeoutInterval);
        
        ws.onopen = function(event) {
            clearTimeout(timeout);
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.log('ReconnectingWebSocket', 'onopen', url);
            }
            // self.readyState = OPEN;
            self.setstate(OPEN);
            reconnectAttempt = false;
            self.onopen(event);

           console.log('after onopen ws-state='+self.getstatestr());
        };
        
        ws.onclose = function(event) {
            console.log('ReconnectingWebSocket', 'CLOSE-CALLED-RIGHT-AFTER?!', url);
            clearTimeout(timeout);

            /////// make sure the client pushes informs the server the connection is closed...?
            // ws.close(7,'forced-closed-by-client='+forcedClose);   // TODO: TEST / VERIFY...
            // ws.terminate();
            ///////

            ws = null;
            if (forcedClose) {
                // self.readyState = CLOSED;
                self.setstate(CLOSED)
                self.onclose(event);
            } else {
                // self.readyState = CONNECTING;
                self.setstate(CONNECTING)
                self.onconnecting();
                if (!reconnectAttempt && !timedOut) {
                    if (self.debug || ReconnectingWebSocket.debugAll) {
                        console.log('ReconnectingWebSocket', 'onclose', url);
                    }
                    self.onclose(event);
                } else if (timedOut) {
                    if (self.debug || ReconnectingWebSocket.debugAll) {
                        console.log('ReconnectingWebSocket', 'timedOutAndClosed', url);
                    }
                }
                setTimeout(function() {
                    console.log('ReconnectingWebSocket', 'RECONNECTING?!!!  ', url);
                    connect(true);
                }, self.reconnectInterval);
            }
        };

        ws.onmessage = function(event) {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.log('ReconnectingWebSocket', 'onmessage', url, event.data);
            }
            self.onmessage(event);
        };

        ws.onerror = function(event) {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.log('ReconnectingWebSocket', 'onerror', url, JSON.stringify(event));
            }
            self.onerror(event);
            // SHOULD ws.onclose() BE CALLED RIGHT AFTER THIS?
            // ws.close();
        };
    }

    // Create the actual WebSocket connection! 
    // connect(url);
    connect(false);

    // this.sendRetry = 0;
    this.send = function(data) {
        // Sanity check: WebSocket in viable state for 'send'.
        if (self.debug || ReconnectingWebSocket.debugAll) {
            console.log('ReconnectingWebSocket', 'checking state before sending to \'' + url + '\'...' + '(ws-state='+self.getstatestr()+'):', data);
        }

        if (ws && ws.readyState == OPEN) {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.log('ReconnectingWebSocket', 'send', url, data);
            }
            // return ws.send(data);
            try {
              ws.send(data, function ack(error) {
                if(error) 
                  throw error; 
                console.log('ReconnectingWebSocket', 'success! (sent: ' + data + ')');
              });
            } catch (error) {
              console.log('ReconnectingWebSocket', 'no websocket connection - can\'t send \'' + data + '\'');

              /*
               * TODO: TEST!!! connect *then* resend again? keep track of retries? need timers? 
               */

              // TODO: send data back to pebble to retry soon...
              // initWebSocket( appinfo.config['serverURL'], appinfo.config['serverPort'] ); 
              // connect(false);
              // this.send(data);              
            }
        } else { // ws == null OR ws.readyState != OPEN
            console.log('ReconnectingWebSocket', 'can\'t send - websocket in bad state (' + this.getstatestr() + ')');

            // This websocket is bad...rebuild the connection and resend data. 
            // dataToSend = data;
            // repairWebsocket();

            /*
             * TODO: TEST!!! connect *then* resend again? keep track of retries? need timers? 
             */
            // console.log('sendRetry='+this.sendRetry);

            // if (this.sendRetry < 1) {
            //   this.sendRetry += 1;
            //   this.close();
            //   // connect(true);

            //   // setTimeout(function() {
            //   //     console.log('ReconnectingWebSocket', 'refreshing...', url);
            //   //     this.send(data);
            //   //     // connect(true);
            //   // }, self.reconnectInterval);

            //   var sendLocalWs = ws;
            //   var sendData = data; 
            //   var sendTimeout = setTimeout(function() {
            //       console.log('ReconnectingWebSocket', 'refreshing...', url);

            //       // timedOut = true;
            //       sendLocalWs.send(sendData); // TODO: BUG! This should be triggering ws.onclose() to initiate a reconnect attempt...
            //       // timedOut = false;
            //       // connect(true);   // HACK (see above) -- need to manually trigger a call to connect since localWs.close() isn't doing it for some reason...
            //   }, self.timeoutInterval);


            // } else { // sufficient retries -- now send error.
            //   this.sendRetry = 0;
            //   this.close();
            //   sendStringToPebble('AppKeySendError', this.getstatestr());
            // }

            // sendStringToPebble('AppKeySendError', this.getstatestr());
            // throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
        }

        // Errors (both immediate and async write errors) can be detected in an optional
        // callback. The callback is also the only way of being notified that data has
        // actually been sent.
        // if (websocket) {
        //   try {
        //     websocket.send(msg, function ack(error) {
        //       if(error) throw error; 
        //       log('WEBSOCKET-TX success!', msg);
        //     });
        //   } catch (error) {
        //     log('WEBSOCKET-TX', 'no websocket connection - can\'t send \'' + msg + '\'');
        //     // TODO: send msg back to pebble to retry soon...
        //       initWebSocket( appinfo.config['serverURL'], appinfo.config['serverPort'] ); 
        //   }
        // } else {
        //   log('WEBSOCKET-TX', 'websocket null - can\'t send \'%s\'', msg);
        // }
    };

    this.close = function() {
        if (ws) {
            forcedClose = true;
            ws.close();
        }
    };

    /**
     * Additional public API method to refresh the connection if still open (close, re-open).
     * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
     */
    this.refresh = function() {
        if (ws) {
            ws.close();
        }
    };
}

/**
 * Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
 */
ReconnectingWebSocket.debugAll = appinfo.config['appjsDebug']; // false by default
// module.exports = ReconnectingWebSocket;
// module.exports.ReconnectingWebSocket = ReconnectingWebSocket;


/* -------------------------------------------------------------------------- *
 *  WebSocket communication handlers.
 * -------------------------------------------------------------------------- */

/*
 * "Constructor" for the Reconnecting-capable WebSocket connection.
 */
// function initWebSocket(host, port) {
//   wsUri = 'ws://'+host+':'+port;
//   websocket = new ReconnectingWebSocket(wsUri);
// }

function connectWebsocket() {
  console.log('connect-websocket (websocket-before=' + JSON.stringify(websocket) + ')');

  // If connected already, disconnect, wait a short bit, then reconnect. 
  if (websocket) {
    disconnectWebsocket();
    var disconnectTimeout = setTimeout(function() {
      websocket = new ReconnectingWebSocket(wsUri);
    }, 2000);
  } else {
    // If not connected already, just connect! 
    websocket = new ReconnectingWebSocket(wsUri);
  }

  console.log('connect-websocket (websocket-after=' + JSON.stringify(websocket) + ')');
}

function disconnectWebsocket() {
  console.log('disconnect-websocket (websocket-before=' + JSON.stringify(websocket) + ')');
  if (websocket) {
    websocket.close();
    websocket = null;
  }
  console.log('disconnect-websocket (websocket-after=' + JSON.stringify(websocket) + ')');
}

function doWsSend(msg) {
  if (websocket) {
    websocket.send(msg);
  } else {
    var msg = 'websocket==null';
    console.log('AppKeySendError - ' + msg);
    sendStringToPebble('AppKeySendError', msg);
  }
}

/* -------------------------------------------------------------------------- *
 *  Pebble BT communication handlers. 
 * -------------------------------------------------------------------------- */

/* 
 * Setup listener for the AppMessage ('appmessage') event, which fires when an 
 * AppMessage is sent -from- the Pebble smartwatch -to- the smartphone.
 */
Pebble.addEventListener('appmessage', function(e) {
    var msg = 'AppMessage from Pebble received: ' + JSON.stringify(e.payload) + ' ';
    var key;
    var wsSendFlag = false; 

    if (e.payload['AppKeyJSReady']) {
      // no-op -- cool...I sent this to you first...and this means nothing to 
      // me now...I was just letting you know you can talk to me now...
      key = 'AppKeyJSReady';

    } else if (e.payload['AppKeySendMsg']) {
      // Send message from pebble on to the proxy.
      key = 'AppKeySendMsg';
      wsSendFlag = true;

    } else if (e.payload['AppKeyRecvMsg']) {
      // no-op -- pebble can't tell ME it received a message from the Game Server
      // because only I can do that! Silly pebble...you're drunk pebble, go home.
      key = 'AppKeyRecvMsg';

    } else if (e.payload['AppKeyLocation']) {
      // Get an update on the location per the request of the pebble watch and 
      // send location data back.
      key = 'AppKeyLocation';
      getLocation();

    } else if (e.payload['AppKeyPebbleId']) {
      // Send the super unique pebble ID (i.e., watch token) back.
      key = 'AppKeyPebbleId';
      sendStringToPebble(key, PEBBLE_DEVICE_ID);

    } else if (e.payload['AppKeySendError']) {
      // no-op -- why are you telling me this? I was being nice and letting you 
      // know that I can't seem to talk to YOUR proxy / Game Server...figure it 
      // out yourself, pebble!
      key = 'AppKeySendError';

    } else if (e.payload['AppKeyPebbleFinished']) {
      key = 'AppKeyPebbleFinished';
      if (websocket) {
        websocket.close();
      }

    } else if (e.payload['AppKeyServerConnect']) {
      key = 'AppKeyServerConnect';
      connectWebsocket();

    } else if (e.payload['AppKeyServerDisconnect']) {
      key = 'AppKeyServerDisconnect';
      disconnectWebsocket();
      // if (websocket) {
      //   websocket.close();
      // }

    } else {
      // no-op -- really pebble? you don't make any sense...
      key = 'UnknownKey';
    }

    log('bt-rx', msg); //+ ' <' + key + ':' + e.payload[key] + '>');

    // Hack: print/perform TX after printing RX.
    if (wsSendFlag) doWsSend(e.payload[key]); 

  }
);

/*
 * Wrapper function for sending an AppMessage -to- the Pebble smartwatch -from-
 * the smartphone.
 */
function sendStringToPebble(key, value) {
  // Build message
  var dict = {};
  dict[key] = value;

  // Also inform pebble of the current status of the WebSocket connection (if 
  // that is not the purpose of this message in the first place)....
  if (key !== 'AppKeyConnStatusChange') {
    if (websocket) {
      dict['AppKeyConnStatusChange'] = websocket.getstatestrsimple(); 
    } else {
      dict['AppKeyConnStatusChange'] = server_notconnected_str;
    }
  }

  Pebble.sendAppMessage(dict, 
    function() { // ACK (i.e., communication acknowledged by pebble watch)
      // log('BT-TX', 'sendAppMessage success: \'{' + key + " : " + value + '}\'');
    }, function() { // NACK (i.e., communication not acknowledged by pebble watch)
      log('bt-tx', 'sendAppMessage failed: \'{' + key + " : " + value + '}\'');
  });
}

/* -------------------------------------------------------------------------- *
 *  Pebble system handlers. 
 * -------------------------------------------------------------------------- */

/* 
 * Setup listener for the 'ready' event, which fires when the JS environment on 
 * the phone is first available after launch. 
 */
Pebble.addEventListener('ready', 
  function(e) {
    PEBBLE_DEVICE_ID = Pebble.getWatchToken();
    log('JS', 'PebbleKit JS Environment ready! Pebble Watch Token: ' + PEBBLE_DEVICE_ID);

    // Try to establish connection to proxy over WebSocket.
    host = appinfo.config['serverURL']; 
    port = appinfo.config['serverPort'];
    wsUri = 'ws://'+host+':'+port;

    // Update s_js_ready on the pebble watch.
    sendStringToPebble('AppKeyJSReady', PEBBLE_DEVICE_ID);
  }
);
