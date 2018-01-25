#ifndef __CODE_H
#define __CODE_H

enum {
  AppKeyJSReady = 0,      // The JS environment on the companion smartphone is up and running!
  AppKeySendMsg,          // Send a message over Bluetooth to the companion smartphone and then on to the Game Server
  AppKeyRecvMsg,          // A message from the Game Server is available (arrived over Bluetooth)
  AppKeyLocation,         // Request your GPS location from the companion smartphone
  AppKeyPebbleId,         // Request your unique pebble ID from the companion smartphone
  AppKeySendError,        // Error: companion app can't connect to the Proxy (and ultimately the Game Server).
  AppKeyConnStatusChange,
  AppKeyPebbleFinished,
  AppKeyServerConnect,
  AppKeyServerDisconnect
};

/*
 * Convenience LOG definitions that use the underlying app_log.
 * @param fmt A C formatting string
 * @param args The arguments for the formatting string
 */
#define LOG(fmt, args...) \
  app_log(APP_LOG_LEVEL_DEBUG, __FILE_NAME__, __LINE__, fmt, ## args)

#define LOG_ERROR(fmt, args...) \
  app_log(APP_LOG_LEVEL_ERROR, __FILE_NAME__, __LINE__, fmt, ## args)

#endif // __CODE_H
