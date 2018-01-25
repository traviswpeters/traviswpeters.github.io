---
layout: page
title: Mission Incomputable Protocol
---

### Updates:

***NOTE: This protocol is subject to change. Please refer back to this page regularly.***

* 5/19: added `GAME_OVER` opcode.
* 5/19: added info about what GS and FA should do upon receipt of `GA_HINT` opcode.
* 5/20: in `GA_HINT`, `faName` replaced with `pebbleId`
* 5/20: emphasize that **no modifications or extensions to the standard messages are permitted**.
* 5/20: Optional: Guide Agent accepts `guideId` on the command line (after required arguments) or from user input, rather than picking a fresh random `guideId`. This mechanism would allow a guide to be restarted mid-game, e.g., after a guide crash.
* 5/21: added [diagram](imgs/MI-network.png) of the connections among all the components.
* 5/21: reduced maximum message size to 8K.
* 5/21: added `codeId` field to each code-drop in the `GAME_STATUS` message sent to Guide Agents.
* 5/21: added suggestion about function tables
* 5/23: added `MI_ERROR_INVALID_TEAMNAME` 
* 5/25: added `MI_ERROR_INVALID_ID`
* 5/26: note that `gameID` is *up to* 8 hex digits

## Overview

The Field Agent only communicates with the Game Server.  The Guide Agent only communicates with the Game Server.  The Game Server only communicates over a single DGRAM socket, that is, using UDP datagrams. 

> More precisely, the Pebble smartwatch communicates with the Game Server through a Bluetooth-websockets proxy on the smartphone and a web-sockets-UDP proxy on the Unix side. Your team is responsible for ensuring that the `appinfo.json` file (provided in the starter kit) is configured with the appropriate IP/hostname and port of the corresponding Unix Proxy Server. See the [diagram](imgs/MI-network.png) of the connections among all the components.
> 
> Each team is [assigned two distinct port numbers](https://docs.google.com/spreadsheets/d/1XBjgzSwDg67dQ_ylaTJbXtpaVS_JNBnygsyT2NqZCGg/edit#gid=106970956): one to bind to its Game Server socket, and one to bind to its Unix Proxy Server socket.

For convenience, the Field Agent may have its team name and 2-4 player names compiled into its code; define them as `static const` variables or arrays. (This avoids the need for text entry on the tiny Pebble screen.)

It is your job, as part of your design process, to figure out what state your Game Server, Field Agent, and Guide Agent must maintain in support of the game rules and message formats (specified below). 

## General Flow

1. A Game Server starts running on a preconfigured host/IP and port. It reads a file to load a list of code-drop points.
2. A Guide Agent starts up, opens a UDP socket, and announces its presence to the Game Server by using the socket to send a datagram to the Game Server at its preconfigured host/port address.
3. Some number of Field Agents become 'active' (i.e., open app on Pebble).
4. The Field Agent periodically sends location updates to the Game Server, and (when desired) requests game-status information from the Game Server.  (A Field Agent's first such message is how it introduces itself to the Game Server.)
5. The Guide Agent periodically sends an update to the Game Server, and (when desired) requests game-status information from the Game Server. 
5. When the Guide-Agent player wishes to send a "hint" to one of its Field Agents, the Guide Agent sends the hint to the Game Server, and the Game Server forwards the hint to the specified Field Agent.
6. During the course of a game, the Field Agent, on occasion, sends "neutralization codes" and/or "capture codes" to the game server. 
7. The game continues until one of the following occurs:
    - All code drops have been neutralized.
    - (Optional) terminal input to the Game Server indicates that the game should be ended.
    - (Extension Only) The game timer expires.

## Message Format

The general format for messages sent to and from the game server is as follows:

```
OPCODE|...|...|...
```

* All messages shall include at most 8191 characters, meaning any message can fit in a 8K buffer.
* The `OPCODE` shall be in **UPPERCASE**.
* The opcode and zero or more fields are separated by the `|` symbol (aka, 'pipe' symbol).
* A message that contains an `OPCODE` other than what we've defined below shall be ignored.  If such a message arrives at the Game Server, it should send an `MI_ERROR_INVALID_OPCODE` (see "Game Server Error Codes" below) message to the offending agent. 

> You will need to carefully parse and validate messages. Network services always have to expect the unexpected. Modularize your code so you have a clean parsing subsystem that can do the low-level syntactic parsing and validation, leaving the semantic interpretation and validation to the core logic. 

All opcodes below *shall* be supported by all game servers and field agents; to enable interoperability, **no modifications or extensions to these formats are permitted**.

You are, however, free to define your own opcodes, and the format for those opcodes. ***You must document these new opcodes and message formats in your IMPLEMENTATION notes.*** If your code receives an opcode it does not recognize, it should write a note to the debugging logfile, and it shall otherwise ignore the message.)

You might want to consider [function tables](tips.html#function-tables).

### Common fields

Some fields appear in many opcodes.  For convenience, we define them here.

All messages include the `gameId`; in a few cases, `gameId=0` is accepted.
> When the Game Server receives message a message regarding a `gameId` not matching the id of the current game, the Game Server shall send a `MI_ERROR_INVALID_GAME_ID` response and then ignore the message.

All messages from the Field Agent (FA) also include `pebbleId`, `teamName`, `playerName`. On receipt of messages from an FA, the Game Server shall confirm that `pebbleId` is known and `teamName` matches its known `teamName`. If the `playerName` differs from the `playerName` previously associated with this `pebbleId`, the Game Server *may* update its internal `playerName` for this `pebbleId`.

All messages from the Guide Agent (GA) also include `guideId`, `teamName`, `playerName`. 

Common fields include

* `gameId` is a string consisting of *up to* 8 hexidecimal characters, chosen randomly by the Game Server when it starts up.
*  `guideId` - a string consisting of 8 hexidecimal characters, chosen randomly by the Guide Agent when it starts up. (Optional: Guide Agent accepts `guideId` on the command line (after required arguments) or from user input, which would allow a guide to be restarted mid-game.)
* `pebbleId` is a string of hex digits baked into each Pebble device.
* `teamName` is the name of the team to which the Agent belongs (a string of 1 or more* printable characters (as defined by `isprint()`). (This `teamName` is not necessarily the same as your CS50 Project team name.)
* `playerName` is the name of the Agent (a string of 1 or more* printable characters (as defined by `isprint()`). 
* `lat` is the latitude of a position (a signed decimal number in [-90:90]).
* `long` is the longitude of a position (a signed decimal number in [-180:180]).
	* For example, the `|lat|long|` for one corner of Sudikoff is `|43.706552|-72.287418|`.

> *Your implementation may limit the length of `teamName` and.or `playerName` fields to a comfortable size, if desired.  Such limitations may ease the challenge of displaying the names in a UI, and may help keep total message size within the limit.
 
### Field Agent (FA)

##### OPCODE: `FA_LOCATION`

The primary communication from a Field Agent (FA) to the Game Server (GS) is a formatted message that informs the GS of its location and identifiers that allow the GS and Guide Agent (GA) to uniquely identify a particular FA. Generally this message is for the benefit of the GS and GA, however, if the FA desires it can explicitly request to receive an update from the GS regarding the status and state of the game. 

```
FA_LOCATION|gameId|pebbleId|teamName|playerName|lat|long|statusReq
```
where

* `gameId` is the game number, or 0 when the FA is just starting.
* `pebbleId` is a unique number baked into each Pebble device.
* `teamName` is the name of the team to which the FA belongs.
* `playerName` is the name of the FA player. 
* `lat` is the latitude of the FA's current position.
* `long` is the longitude of the FA's current position.
* `statusReq` is a boolean flag indicating if the FA would like to receive a game status update (1 = "request update", 0 = "no update").

Upon receipt of this message, the Game Server shall 

* validate the `gameId`, `pebbleId`, `teamName`, and `playerName`, as above.
* if `gameId==0`, register player `pebbleId`, `teamName`, `playerName`.
	* if the `pebbleId` is not yet known, add a new player.
	* if the `pebbleId` is known, and is marked `captured`: ignore.
	* if the `pebbleId` is known, and not marked `captured`: respond as below.
* update records regarding location and last-contact-time of this Field Agent.
* if `statusReq=1`, send a `GAME_STATUS` message back to the Field Agent.

##### OPCODE: `FA_NEUTRALIZE`

The primary objective of Mission Incomputable is to 'neutralize' pages of TSE source code found at code drop locations across campus. To neutralize a page of source code the FA must send a message to the GS indicating its current location  and the unique identifer that represents the page of source code found at that location.

```
FA_NEUTRALIZE|gameId|pebbleId|teamName|playerName|lat|long|codeId
```
where

* `gameId` is the game number.
* `pebbleId` is a unique number baked into each Pebble device.
* `teamName` is the name of the team to which the FA belongs.
* `playerName` is the name of the FA player. 
* `lat` is the latitude of the FA's current position.
* `long` is the longitude of the FA's current position.
* `codeId` is a 4-digit hex code that uniquely identifies a page of source code found at the code drop.

Upon receipt of this message, the Game Server shall 

* validate the `gameId`, `pebbleId`, `teamName`, and `playerName`, as above.
* confirm that the `codeId` matches the `codeId` for a known code drop;
	* if there is no such `codeId`, or this code drop has previously been neutralized, ignore this message.
* otherwise, confirm that the given `lat|long` position is within 10m of the known position of the identified code drop;
	* if so, mark this code drop as 'neutralized' and send a `MI_NEUTRALIZED` message indicating that the Field Agent was successful in neutralizing the code drop.


##### OPCODE: `FA_CAPTURE`

```
FA_CAPTURE|gameId|pebbleId|teamName|playerName|captureId
```
where

* `gameId` is the game number.
* `pebbleId` is a unique number baked into each Pebble device.
* `teamName` is the name of the team to which the FA belongs.
* `playerName` is the name of the FA player. 
* `captureId` is a 4-digit hex "capture code" that is displayed on another player's Pebble, or 0 when FA is indicating its intent to capture. 


Upon receipt of this message, the Game Server shall 

* validate the `gameId`, `pebbleId`, `teamName`, and `playerName`, as above.
* if `captureId` is 0: for each nearby (within 10m) Field Agent (from a different team), generate a random `captureId` and send it to that Field Agent in a `GS_CAPTURE_ID` message.
* if `captureId` is non-zero, confirm that the `captureId` matches the `captureId` provided within the past 60s in response to this Field Agent's request to capture.
	* if so, mark the corresponding Field Agent as 'captured' and send a `MI_CAPTURED` message to the captured Field Agent, send a `MI_CAPTURE_SUCCESS` message to the capturing Field Agent.


### Guide Agent (GA)

##### OPCODE: `GA_STATUS`

The Guide Agent (GA) joins the game by sending its first periodic status message.  In this status message, it can also request to receive an update from the GS regarding the status and state of the game by setting a flag in the fomatted message it sends to the GS.

```
GA_STATUS|gameId|guideId|teamName|playerName|statusReq
```
where

* `gameId` is the game number, or 0 when GA is just starting.
* `guideId` is the guide identifier.
* `teamName` is the name of the team to which the GA belongs.
* `playerName` is the name of the GA player. 
* `statusReq` is a boolean flag indicating if the FA would like to receive a game status update (1 = "request update", 0 = "no update").

Upon receipt of this message, the Game Server shall 

* validate the `gameId`, `guideId`, `teamName`, and `playerName`, as above.
* if `gameId==0`, register player `guideId`, `teamName`, `playerName`.
	* if the `guideId` is not yet known, add a new player.
	* if the `guideId` is known, verify that `teamName` matches its known `teamName`.
* update records regarding last-contact-time of this Guide Agent.
* if `statusReq=1`, send a `GAME_STATUS` message back to the Field Agent.

##### OPCODE: `GA_HINT`

To assist FAs in their game play, the GA requires a mechanism that enables the Guide to send *hints* to its FAs. 

```
GA_HINT|gameId|guideId|teamName|playerName|pebbleId|message
```
where

* `gameId` is the game number.
* `guideId` is the guide identifier.
* `teamName` is the name of the team to which the GA belongs.
* `playerName` is the name of the GA player. 
* `pebbleId` is the Id of pebble for the FA to which a hint will be sent, which must correspond to a player (a Pebble) on the GA's team; alternately `pebbleId` may be `*` to "broadcast" the hint to all FAs on the GA's team. 
* `message` is the "hint" message (free text) that the GA wants to send to a specific FA. A hint has 1..140 printable characters (as defined by `isprint()`), excluding the pipe `|` symbol.

Upon receipt of this message, the Game Server shall

* validate the `gameId`, `guideId`, `teamName`, and `playerName`, as above.
* validate the message format; if invalid, drop this message.
* validate that `faName` is `*`, or a known player on the GA's team. (if invalid, ignore this message.)
* if `faName` is `*`, send this complete message, unchanged, to all FAs on GA's team.
* otherwise, send this complete message, unchanged, to the named FA.
* update records regarding last-contact-time of this Guide Agent.


### Game Server (GS)

The Game Server (GS) is responsible for tracking the state of the game, responding to 'neutralize' and 'capture' situations, and sending updates to a Field Agent (FA) or Guide Agent (GA) upon request.

#### To Field Agents

##### OPCODE: `GAME_STATUS`

```
GAME_STATUS|gameId|guideId|numRemainingCodeDrops|numFriendlyOperatives|numFoeOperatives
```
where

* `gameId` is the game number.
* `guideId` is the identifier of this team's Guide Agent, or 0 if not yet known.
* `numRemainingCodeDrops` is number of remaining (active) code drops.
* `numFriendlyOperatives` is the number of friendly operatives (i.e., FAs from your team) still active (i.e., excluding captured agents).
* `numFoeOperatives` is the number of foe operatives (i.e., FAs from other teams) still active (i.e., excluding captured agents).

Upon receipt of this message, the Field Agent updates its internal records about the state of the game.

##### OPCODE: `GS_CAPTURE_ID` 

A notification by the Game Server to a Field Agent (FA) that this FA is about to be captured.

```
GS_CAPTURE_ID|gameId|captureId
```
where

`captureId` is a string of 4 hexadecimal digits, which the Pebble should  display for the next 60s, or until it receives an `MI_CAPTURED` message.

##### OPCODE: `GA_HINT` 

See above for the format of a `GA_HINT` message.

Upon receipt of this message, the FA shall

* validate the `gameId` and `teamName`, as above.
* ignore `guideId`. assume `playerName` is correct.
* validate that `faName` is `*`, or the name of this FA. (if invalid, ignore this message.)
* display the `message` to the player, in a suitable format, as a hint from `playerName`.


#### To Guide Agents

```
GAME_STATUS|gameId|fa1:fa2:...:faN|cd1:cd2:...:cdM
```

where

* `gameId` is the game number.
* `fa` represents a record for one agent known to the GS. Each `fa` record is separated by colons. Each `fa` record contains comma-separated sub-fields `pebbleId`, `teamName`, `playerName`, `playerStatus`, `lastKnownLat`, `lastKnownLong`, `secondsSinceLastContact` where
    * `pebbleId` is a unique number baked into each Pebble device.
    * `teamName` is the name of the team to which the FA belongs.
    * `playerName` is the name of the FA player.
    * `playerStatus` is the "status" of a FA (`active` or `captured`).
    * `lastKnownLat` is the latitude of the last known position of the FA.
    * `lastKnownLong` is the longitude of the last known position of the FA.
    * `secondsSinceLastContact` is the number of seconds elapsed since the GS had any message from the FA.

Example:

```
COMING SOON...
```

* `cd` represents a record for one code drop known to the GS. Each `cd` record is separated by colons. Each `cd` record contains comma-separated sub-fields `codeId`, `lat`, `long`, `neutralizingTeam` where
	 * `codeId` is the 4-digit hex code for the code drop.
    * `lat` is the latitude of the position of the code drop.
    * `long` is the longitude of the position of the code drop.
    * `neutralizingTeam` is the name of the team that neutralized the code drop, or `NONE` if code drop has not yet been neutralized.

Example:

```
COMING SOON...
```

#### To All Agents

When the game ends, the GS sends the following message to all players.

##### OPCODE: `GAME_OVER`

```
GAME_OVER|gameId|numRemainingCodeDrops|t1:t2:...:tK
```
where

* `gameId` is the game number.
* `numRemainingCodeDrops` is number of remaining (active) code drops. (This number may be greater than zero if the game ends early.)
* `t1:t2:...:tK` is a series of K colon-separated team records, one for each of K teams playing the game. Each team record is a comma separated list of `teamName`, `numPlayers`, `numCaptures`, `numCaptured`, `numNeutralized`, where
	* `teamName` is this team's name,
	* `numPlayers` is the number of players ever active on that team,
	* `numCaptures` is the number of opposing players captured by any player on this team, 
	* `numCaptured` is the number of this team's players who were captured during the game, 
	* `numNeutralized` is the number of code drops this team neutralized during the game.

Upon receipt of this message, the Agent notifies its player that the game is over and reports (in some suitable format) the overall game results. The Guide Agent should then exit.


#### Game Server Response Codes

For debugging and convenience the Game Server shall respond to various conditions via a message formatted as follows:

```
GS_RESPONSE|gameId|respCode|message
```
where

* `gameId` is the game number.
* `respCode` is one of the response codes below.
* `message` is human-readable text that you are free to define as you see fit.

> You are permitted to add other response codes.  A client (agent) receiving an unrecognized response code can log it, then ignore it.

##### `MI_ERROR_INVALID_OPCODE` 

An error code sent by the Game Server to any type of agent if an invalid `OPCODE` is sent as part of a message. 

##### `MI_ERROR_INVALID_GAME_ID` 

An error code sent by the Game Server to any type of agent if an invalid `gameId` is sent as part of a message. 

##### `MI_ERROR_INVALID_TEAMNAME` 

An error code sent by the Game Server to any type of agent that sends a `teamName` that is either syntactically invalid or not identical to the `teamName` used by this agent in prior communications. 

##### `MI_ERROR_INVALID_ID` 

An error code sent by the Game Server to any type of agent that sends an ID (`guideId` or `pebbleId`) that is either syntactically invalid or not one used by any agent in prior communications.  (Note, of course, that a fresh ID is always expected, and accepted, in an `FA_LOCATION` or `GA_STATUS` message with `gameId==0`, because that's how a new guide or field agent joins the game).

##### `MI_NEUTRALIZED` 

A response by the Game Server to a Field Agent in response to a successful neutralization `codeId` submitted to the Game Server. See `GS_CAPTURE_ID` above.

##### `MI_CAPTURE_SUCCESS` 

A response by the Game Server to a Field Agent in response to a successful capture code submitted to the Game Server.

##### `MI_CAPTURED` 

A notification by the Game Server to a Field Agent indicating that it has been captured and is now out of the game.


### Communication Debugging / Testing

It is largely up to your team to determine how best to debug/test the flow of communication from between Field Agents, Game Servers, and Guide Agents. 

We do, however, provide a simple proxy server that can be used as an aid in debugging the communication flow between a Field Agent and Game Server. The proxy can be configured at start up to log to `stdout`. You can run the proxy with the following flags to determine its output:

* no flags: no output, just be a proxy!
* `-fa2gs`: log all communications from the Field Agent to the Game Server.
* `-gs2fa`: log all communications from the Game Server to the Field Agent.
* `-all`: log all communications between the Game Server and the Field Agent.

## Code-drop file

This file contains the list of code-drop locations, one per line. Each line has the format

```
latitude, longitude, codeId
```

where `latitude` and `longitude` are both decimal numbers that can be read into a floating-point variable, and `codeId` is a 4-digit code that can be read into an integer via a hexidecimal format (each digit can be a hexidecimal digit (i.e., [0-9A-F]). 

For example,

```
43.706552, -72.287418, 86DA
43.709259, -72.284328, F200
```

We will soon set up code drops around campus, and provide a code-drop file, but we may use a different set of code-drop locations for testing. You are welcome to test with your own code-drop file as well.

## Log files
moved to the [mission page](mission.html#log-files).