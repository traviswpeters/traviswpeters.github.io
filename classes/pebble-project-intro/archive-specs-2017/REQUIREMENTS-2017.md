---
layout: page
title: KRAG Requirements Spec
---

In the Final Project documents, note that *group* refers a set of CS50 students assigned to work together, and *team* refers to a set of players who play the game.

* TOC
{:toc}

-------------------------------------------------------------------------

## Updates {#updates}

A list of the changes made since the project was announced (most-recent changes at the top of the list):

* Fix a typo (GA should be GS) about `lastContact` in [GS_AGENT](#gs-agent).
[[Piazza@461](https://piazza.com/class/izsl3qrp6l86gp?cid=461)]
* Clarify that message recipient need only report the first error found in a [message](#messages).
[[Piazza@440](https://piazza.com/class/izsl3qrp6l86gp?cid=440)]
* Clarify what to do in response to [`FA_CLAIM`](#fa-claim) when there are fewer than two clues left.
* Clarified specs for `kragId` and *hex codes* in [messages](#fields).
[[Piazza@396](https://piazza.com/class/izsl3qrp6l86gp?cid=396)]
* Clarified fields "in any order" in [messages](#messages).
[[Piazza@409](https://piazza.com/class/izsl3qrp6l86gp?cid=409)]
* Added new [`GS_CLAIMED`](#gs-claimed) message, which shall be sent to the Guide Agent whenever one of its team's Field Agents successfully claims a krag.
* Added `kragId` as a required field in [`GS_CLUE`](#gs-clue) message, and removed location fields from that message.
* Disallow Field Agents from picking the same name; affects [`FA_LOCATION`](#fa-location) and adds [`SH_ERROR_DUPLICATE_PLAYERNAME`](#sh-error-duplicate-playername).
[[Piazza@370](https://piazza.com/class/izsl3qrp6l86gp?cid=370)]
* Constrained the krag locations to this [campus map](imgs/campus-map.png).
[[Piazza@390](https://piazza.com/class/izsl3qrp6l86gp?cid=390)]
* Clarified what should happen if a [message](#messages) contains a duplicate `fieldName`: it shall be ignored.
* Clarified what should happen if a [gameserver](#server) or [guideagent](#guide) command-line argument is duplicated; print an error and exit with non-zero status.
[[Piazza@386](https://piazza.com/class/izsl3qrp6l86gp?cid=386)]
* [Clarified](#gs-clue) that, after an FA claims a new krag, the GS sends `GS_CLUE` messages to the GA on the same team as that FA.
[Piazza@364](https://piazza.com/class/izsl3qrp6l86gp?cid=364)
* Clarified that Field Agent needs a mechanism for input of a hex code.
* Updated the method for [revealing the secret string](#reveal).
* Clarified that the revealed-secret string is initialized with underscore characters.
* Extend command-line parameters for `gameserver` to add `sf=pathname` parameter; describe the [secret-file format](#secret-format).

-------------------------------------------------------------------------

## The Game {#game}

*Intelligence reports indicate that Russian hackers may have inflitrated the recent Student Assembly election, casting doubts on the integrity of the results.*
*Unfortunately, the hackers encrypted their secret plans with an encryption key -- fragments of which are scattered across the Dartmouth campus.*
*An undercover Dartmouth society calling itself* ***Swollef Gninrael*** *has uncovered the key fragments ("krags").*
*Fortunately, discovery of each krag unlocks clues to the location of two more krags.*
*Only once you solve all the clues and assemble all krags will you be able to decode the hackers' plans and restore the integrity of the election.*

*The catch?  Other teams are racing to find all the clues first!*

-------------------------------------------------------------------------

## Game Rules {#rules}

This game, like a scavenger hunt, is a game of cooperation and competition.

The game involves one or more *teams*.
The objective of the game is to decode the hacker's secret plans.
The team that first decodes the hacker's secret wins the game.

New teams may join at any time during the game.
Each team has two or more *players*.

 * New players may join at any time during the game, specifying their team.
 * If the specified team is new to the game, the game now has one more team.
 * Once joined, a player cannot switch teams.

Each team has two kinds of player: one *guide agent* and one or more *field agents*.

 * The *guide agent* uses a laptop application to view the overall game status, and can send hints to the team's field agents.
 * The *field agents* wear a Pebble and run around [campus](imgs/campus-map.png), seeking to find and claim krags.

For each krag there is a predefined *clue* -- a short textual description of where that krag can be found on [campus](imgs/campus-map.png).

When a team's guide agent first joins, it is given a clue for one random krag and a string represneting the hacker's secret plan with all characters hidden.

A *krag* is a piece of paper, posted in a public space, with a 4-digit hex code printed on the paper.
A krag is *claimed* when the field agent is close enough to read the code and correctly enter that code on her Pebble screen.
When a team *claims* a krag it has not claimed before, (1) it is provided clues to the location of two krags it has not received before, and (2) it is provided an updated secret with more characters revealed.
In effect, a krag allows the team to unlock more of the secret.

The *game ends* when a team has claimed all krags -- enabling it to fully decode the hackers' plans -- or when the game-server user provides input to end the game early.

When the game ends, teams may be ranked by the number of krags each has claimed.

-------------------------------------------------------------------------

## Components {#components}

The game software shall comprise three components: the Field Agent, the Guide Agent, and the Game Server.

### Field Agent

The Field Agent (FA) is software for a player that runs around campus seeking key fragments.

The Field Agent app *shall*

* Run on the Pebble; see the [Pebble](pebble.html) page.
* Play according to the above rules of the game.
* Communicate (indirectly) with the Game Server via the [protocol](#protocol) to
	 * send the Game Server the player's current location four times per minute.
	 * inform the Game Server when this player claims a krag (by providing a 4-digit hex code).
	 * receive hints from the Guide Agent.

* Present a suitable interface, of your own design, to allow the player to
	 * choose from a preconfigured list of player names, and join a game under that name.
	 * input a 4-digit `kragId`
	 * present hints from the Guide Agent.
	 * present information about the game status.
 * allow player to "claim" a krag by entering its 4-digit hex code.

* Log all its activity to a [logfile](#log-format).

### Guide Agent {#guide}

The Guide Agent (GA) is software for a player that monitors and advises its team's Field Agents.

The Guide Agent application *shall*

* Run on a CS50 Unix server (though for testing you may run it on your laptop).
* Accept and validate the following command-line arguments, in any order:

	`./guideagent guideId=... team=... player=... host=... port=...`
	 * `guideId` provides the hexadecimal ID number for this player;
	 * `team` provides the name of the team to which the Agent belongs;
	 * `player` provides the name of the guide Agent;
	 * `host` provides the host name of the Game Server (e.g., `flume.cs.dartmouth.edu`);
	 * `port` provides the port number of the Game Server.

	> The format of *guideId*, *team*, and *player* are described in the [message fields](#fields) below.
	> For any missing, malformed, or duplicate arguments, `guideagent` should print an error and exit with non-zero status.
	> For unrecognized arguments, `guideagent` should print a warning but otherwise ignore them.

* Play according to the above [rules](#rules) of the game.

* Communicate with the Game Server via the [protocol](#protocol) to
	* join the game (on error, print appropriate message and exit with non-zero status);
	* receive updates about the current location and status of players on Guide's team;
	* receive clues about the location of krags;
	* receive updates about the hacker's secret;
	* receive updates about game status.

* Present a suitable interface, of your own design, to present the Guide player with information:
	* see the current game statistics;
	* see the current location and status of each player on Guide's team;
	* see the current secret string;
	* see a list of known clues.

* Present a suitable interface, of your own design, to allow the Guide player to input information:
	* send a textual *hint* to a chosen Field Agent on the Guide's team.
* Log all its activity to a [logfile](#log-format).
* Exit when the game ends, printing a summary of the game's outcome (list of team names and number of krags claimed by each, ranked by krag-claim count).

For a ***three-person group***: design an interface using stdout and stdin.
The format of this interface is for you to design.

For a **four-person group**: design a visual interface (using [ncurses](index.html#ncurses)), displaying a campus map with a marker placed at the most-recent location of each of this team's players and a marker placed at the location of all claimed krags.
The display must also include a space for Guide player input.
The format and layout of the display is for you to design, but should approximate the area depicted in this [campus map](imgs/campus-map.png).
Because you are using ncurses, your display (including the map) will be entirely done with ASCII art - that is, entirely made of everyday characters.
Each characters' foreground and background color can be manipulated, which gives you a rather rich design space.


### Game Server  {#server}

The Game Server (GS) application coordinates one (and only one) game each time it runs.
It *shall*

* Run on a CS50 Unix server (though for testing you may run it on your laptop).
* Accept and validate the following command-line arguments:

	`./gameserver gameId=... kff=... sf=... port=...`
	 * `gameId` provides the hexadecimal ID number of this game;
	 * `kff` provides the path to the krag file, which contains coordinates and clues for each krag;
	 * `sf` provides the path to the secret file, which contains a single line of text representing the secret.
	 * `port` provides the port number of the Game Server.

	> The format of `gameId` is described in the [message fields](#fields) below.
	> For any missing, malformed, or duplicate arguments, `gameserver` should print an error and exit with non-zero status.
	> For unrecognized arguments, `gameserver` should print a warning but otherwise ignore them.

* Read a list of krags from a file; see [format](#kff-format).
* Read the secret from a file; see [format](#secret-format).
The secret does not include the newline.
* Create a DGRAM socket and bind it to the given port number; on any failure, print an appropriate error message and exit with non-zero status.
* Coordinate game according to the [rules](#rules) above.

* Communicate with Field Agents via the [protocol](#protocol) to
	* ignore all messages that refer to a game number different than the game in progress;
	* accept new Field Agents, and respond with a [`GAME_STATUS`](#gs-status) message;
	* forward custom hints from the Guide Agent;
	* send [`GAME_STATUS`](#gs-status) updates on request;
	* receive from Field Agents a request to claim a krag, and respond with indication of whether the claim was successful; where *success* means the krag has not already been claimed by this team;
	* upon receiving a valid krag code from a Field Agent, the Game Server shall randomly choose two clues for krags that have not yet been given to this team, and forward those clues to the Guide Agent on the same team as this Field Agent.
(When this team has already received all clues, no clues are sent.)
(When this team has already received all but one clue, only one clue is sent.)
	* upon receiving a valid krag code from a Field Agent, the Game Server shall [reveal](#reveal) part of the secret string and send a [`GS_SECRET`](#gs-secret) message to the Guide Agent.

* Communicate with Guide Agents via the [protocol](#protocol) to
	 * ignore messages that refer to a game number different than the game in progress;
	 * accept new Guide Agents, and respond with [`GAME_STATUS`](#gs-status) followed by one [`GS_CLUE`](#gs-clue);
	 * ignore messages from new Guide Agents who declare a team for which there is already a Guide Agent;
	 * receive requests to forward a hint to a given teammate, and send that hint to that teammate;
	 * send [`GAME_STATUS`](#gs-status) updates on request.

* Track the following stats and status:
	* elapsed time since start of game, in seconds;
	* number of krags;
	* number of agents (each of which has a human player);
	* number of teams;
	* for each team,
		* name of its Guide Agent player;
		* name and location of each Field Agent player;
		* number of krags claimed;
		* partly-revealed secret string.

* Present a textual summary of game status on the terminal, updating the summary as the game evolves.
***Four-person groups*** may *optionally* present this in a visual form, such as a map, using ncurses.
* Log all its activity to a [logfile](#log-format).
* End the game when all krags have been claimed, ***or*** when the user at terminal indicates that the game should end early.
* When the game ends, send a game summary to all players, then exit.

#### Revealing the secret string {#reveal}

The Game Server slowly reveals characters of the secret string, as a team claims krags.
The actual secret string is read from the [secret file](#secret-format).
The team's revealed secret string should be initialized to a string of the same length as the actual secret string, but with all characters replaced with underscores (`_`).

When the team later claims a krag, the Game Server reveals one or more characters of the secret string.
By *reveal* we mean to change the value of that character in the revealed string to the corresponding character from the actual secret string.

Let *n* be the length of the secret string; its characters are numbered *0 <= j < n*.

Let *k* be the number of krags in the game, and assume the krags are numbered *0 <= i < k*, according to their order in the krag file.
(Note these numbers have nothing to do with the `kragId`.)
Assume *1 < k <= n*.

When a team claims krag number *i*, reveal characters at all positions *j* where *j % k == i*.


-------------------------------------------------------------------------

## Protocol {#protocol}

The three components communicate with each other via UDP datagrams, each containing a single protocol message using the format described below.

### Overview
The Field Agent only communicates with the Game Server.
The Guide Agent only communicates with the Game Server.
The Game Server uses a single DGRAM socket to send and receive UDP datagrams.

> More precisely, the Pebble smartwatch communicates with the Game Server through a Bluetooth-websockets proxy on the smartphone and a web-sockets-UDP proxy on the Unix side.
> Your group is responsible for ensuring that the `appinfo.json` file (provided in the starter kit) is configured with the appropriate IP/hostname and port of the corresponding Unix Proxy Server.
> See the [diagram](imgs/MI-network.png) of the connections among all the components.
>
> Each group is [assigned two distinct port numbers](https://docs.google.com/spreadsheets/d/1tPVXaobRS7FAJveszfCk7lk0C_NrktrynLiMjBO8_YM/edit#gid=106970956): one to bind to its Game Server socket, and one to bind to its Unix Proxy Server socket.

For convenience, the Field Agent must have its team name and 2-4 player names compiled into its code; define them as `static const` variables or arrays.
(This avoids the need for text entry on the tiny Pebble screen.)

It is your job, as part of your design process, to figure out what state your Game Server, Field Agent, and Guide Agent must maintain in support of the game rules and message formats (specified below).

### General Flow

1. A Game Server starts up, creates a DGRAM (UDP) socket and binds it to a given host/IP and port.
It reads a [file](#kff-format) to load a list of krags.
2. A Guide Agent starts up, creates a DGRAM (UDP) socket, and announces its presence to the Game Server by using the socket to send a [`GA_STATUS`](#ga-status) message to the Game Server at the server's host/port address.
3. Some number of Field Agents become 'active' (i.e., open app on Pebble), and connect to the proxy on the phone paired with that Pebble.
**NOTE: your proxy should be running before any FAs attempt to join a game.**
4. The Field Agent periodically sends [`FA_LOCATION`](#fa-location) messages to the Game Server, and (when desired) requests a game-status response from the Game Server.
(A Field Agent's first location-update message is how it introduces itself to the Game Server.)
5. The Guide Agent periodically sends a [`GA_STATUS`](#ga-status) message to the Game Server, and (when desired) requests a [`GS_STATUS`](#gs-status) response from the Game Server.
5. When the Guide-Agent player wishes to send a "hint" to one of its Field Agents, the Guide Agent sends [`GA_HINT`](#ga-hint) to the Game Server, and the Game Server forwards the hint to the specified Field Agent.
6. During the course of a game, the Field Agent, on occasion, sends the krag code via [`FA_CLAIM`](#fa-claim) to the game server.
	- The Game Server then sends up to two [`GS_CLUE`](#gs-clue) messages to the Guide Agent.
	- The Game Server also sends a [`GS_SECRET`](#gs-secret) message to the Guide Agent.
7. The game continues until one of the following occurs:
    - all krags have been claimed.
    - terminal input to the Game Server indicates that the game should be ended.
8. When the game ends, the Game Server sends a [GAME_OVER](#game-over) message to all Agents.

### Message Format {#messages}

The format for messages sent to and from the game server follows this syntax (in [BNF](https://en.wikipedia.org/wiki/Backus–Naur_Form) notation):

```
message   ::= field[|<field>]...
field     ::= <fieldName>=<fieldValue>
```
where
the `fieldName` is chosen from from the [list of fieldnames]({#fields}) below,
and the `fieldValue` depends on the type of field, below.

Less formally, a typical message looks like this:

```
opCode=OPCODE|fieldName1=fieldValue1|fieldName2=fieldValue2
```

* All messages shall include at most 8191 characters, meaning any message can fit in an 8K buffer.
* Fields may occur in arbitrary order within the message; that is, the sender may assemble fields in any order, and the receiver must not expect any particular order.
* The fields are separated by the `|` symbol (aka the 'pipe' symbol), with no spaces.
* Each field contains a field name and a field value separated by the `=` symbol, with no spaces other than those that may be part of the value.
* A message shall include exactly one `opCode` field.
* If message violating the above rules arrives at the Game Server, the Game Server shall ignore the message and send an [`SH_ERROR_INVALID_MESSAGE`](#sh-error-invalid-message) response to the offending Agent.
* A message that contains a duplicate `fieldName` shall also be ignored.
If such a message arrives at the Game Server, the Game Server shall send an [`SH_ERROR_DUPLICATE_FIELD`](#sh-error-duplicate-field) response to the offending Agent.
* A message that contains an unrecognized `fieldName` shall also be ignored.
If such a message arrives at the Game Server, the Game Server shall send an [`SH_ERROR_INVALID_FIELD`](#sh-error-invalid-field) response to the offending Agent.
* A message that contains an `OPCODE` other than what we've defined below shall be ignored.
If such a message arrives at the Game Server, the Game Server shall send an  [`SH_ERROR_INVALID_OPCODE`](#sh-error-invalid-opcode) response to the offending Agent.
* If a message contains any error, such as those above, the recipient may report the error and ignore processing the message further; that is, the recipient need not find and report all errors in the message.

> You will need to carefully parse and validate messages.
Network services always have to expect the unexpected.
Modularize your code so you have a clean parsing subsystem that can do the low-level syntactic parsing and validation, leaving the semantic interpretation and validation to the core logic.
> We recommend you consider [function tables](index.html#function-tables) for handling OPCODEs and fieldNames.

### Message Fields {#fields}

Each field has a specific name; field names are case-sensitive.
Each opcode expects/allows a different subset of fields.

* `opCode` is one of the opcodes defined in [opCodes](#opCodes).
* `respCode` is one of the response codes defined in [response codes](#response-codes).
* `kragId` is a *hex code* of 4 hex digits (see below about *hex code*).
* `gameId` is a *hex code* of 1 to 8 hex digits.
* `guideId` is a *hex code* of 1 to 8 hex digits.
* `pebbleId` is a *hex code* of 8 hex digits (the rightmost 8 characters of the Pebble device number).
* `lastContact` is the integer number of seconds since the GA last received a message from the FA.
* `latitude` is the latitude of a position (signed decimal number [-90.0:90.0]).
* `longitude` is the longitude of a position (signed decimal number [-180.0:180.0]).
* `numPlayers` is the integer number of players on that team.
* `numClaimed` is the integer number of krags that the team has claimed.
* `numKrags` is the integer total number of krags.
* `statusReq` is a boolean integer indicating if an Agent would like to receive a game status update (1=yes, 0=no).
* `player` is *text* representing the name of the Agent (max 10 chars).
* `team` is *text* representing the name of the team to which the Agent belongs (max 10 chars).
* `hint` is *text* providing a hint from the Guide Agent (max 140 chars).
* `clue` is *text* providing a krag clue from the Game Server (max 140 chars).
* `secret` is *text* providing the partly-revealed secret from the Game Server (max 140 chars).

In this game, a ***hex code*** is a hexadecimal number that can be read by a hexadecimal format (`%x`) in `sscanf`.
A *hex digit* is one of the hexadecimal characters [0-9A-Fa-f].
All *hex codes* are interpreted as numbers (not strings);
thus, leading zeroes need not occur in a string representation.
An 8-digit hex code can fit in an `unsigned int`,
and a 4-digit hex code has value less than or equal to `0xFFFF`.
No valid `Id` has value zero.

In this game, ***text*** is a string of 1 or more printable characters, as defined by `isprint()`, except for `|` or `=`.

### OpCodes {#opcodes}

All opcodes below *shall* be supported; to enable interoperability, **no modifications or extensions to these formats are permitted**.

#### `FA_LOCATION` {#fa-location}

The primary communication from a Field Agent (FA) to the Game Server (GS) is a formatted message that informs the GS of its location and identifiers that allow the GS and Guide Agent (GA) to uniquely identify a particular FA.
Generally this message is for the benefit of the GS and GA, however, if the FA desires it can explicitly request to receive an update from the GS regarding the status and state of the game.

##### General Format
	opCode=FA_LOCATION|gameId=|pebbleId=|team=|player=|latitude=|longitude=|statusReq=

##### Example Usage
	opCode=FA_LOCATION|gameId=FEED|pebbleId=8080477D|team=aqua|player=Alice|latitude=43.706552|longitude=-72.287418|statusReq=1

where

* `gameId` is the game number, or 0 when the FA is just starting.
* `pebbleId` represents the specific Pebble device.
* `team` is the name of the team to which the FA belongs.
* `player` is the name of the FA player.
* `latitude` is the latitude of the FA's current position.
* `longitude` is the longitude of the FA's current position.
* `statusReq` is a boolean flag indicating if the FA would like to receive a game status update (1 = "request update", 0 = "no update").

##### Recipient Actions
Upon receipt of this message, the Game Server shall

* validate the message fields; ignore the message if anything is invalid.
* if `gameId == 0`
	* and `team` is not known, register `team`. Initialize its revealed-secret string as in [about reveal](#reveal) above.
	* and `pebbleId` is not known, and there is not already a player on this team with the name `player`, register `pebbleId` and associate it with given `player` and `team` names.
		* respond with a [`GAME_STATUS`](#gs-status) message to let the Field Agent know that they have successfully joined the game.
	* if, however, there is already a player on this team with the name `player`, do *not* register a new player.
		* respond with a [`SH_ERROR_DUPLICATE_PLAYERNAME`](#sh-error-duplicate-playername) response code to let the Field Agent know that they cannot join the game with that name.
* if `gameId != 0`
	* validate the `gameId`, `pebbleId`, `team`, and `player`, as above.
	* update records regarding location and last-contact-time of this Field Agent.
	* if `statusReq=1`, send a [`GAME_STATUS`](#gs-status) message back to the Field Agent.


#### `FA_CLAIM` {#fa-claim}

To claim a krag the FA must send a message to the GS indicating its current location and the unique 4-digit hex code found on the krag at that location.

##### General Format
	opCode=FA_CLAIM|gameId=|pebbleId=|team=|player=|latitude=|longitude=|kragId=

##### Example Usage
	opCode=FA_CLAIM|gameId=FEED|pebbleId=8080477D|team=aqua|player=Alice|latitude=43.706552|longitude=-72.287418|kragId=8080

where

* `gameId` is the game number.
* `pebbleId` represents the specific Pebble device.
* `team` is the name of the team to which the FA belongs.
* `player` is the name of the FA player.
* `latitude` is the latitude of the FA's current position.
* `longitude` is the longitude of the FA's current position.
* `kragId` is a 4-digit hex code that uniquely identifies a krag.

##### Recipient Actions
Upon receipt of this message, the Game Server shall

* validate the message fields; ignore the message if anything is invalid.
* confirm that the `kragId` matches the `kragId` for a known krag;
	* if there is no such `kragId`, ignore this message.
* confirm that the given `latitude|longitude` position is within 10m of the known position of the identified krag;
	* if the krag has not been claimed by this team, mark it as 'claimed' and send a [`SH_CLAIMED`](#sh-claim) response to the Field Agent to indicate a success.
	* if the krag has already been claimed by this team, send a [`SH_CLAIMED_ALREADY`](#sh-claimed-already) response to the Field Agent to indicate a failure.
	* send two randomly chosen clues, not before shared with this team, in the form of [`GS_CLUE`](#gs-clue) messages, to the Guide Agent on the Field Agent's team.
[If there is only one clue remaining, send only one; if there are none remaining, send none.]
	* update this team's copy of the secret so as to reveal characters of the string (read [about reveal](#about-reveal) above).
	* send the updated secret, via a [`GS_SECRET`](#gs-secret) message, to the Guide Agent on the Field Agent's team.

#### `FA_LOG` {#fa-log}

The Field Agent can send this message to the Game Server at any time.
It is ignored by the Game Server but is useful for your Field Agent to get information into the log files.

##### General Format
	opCode=FA_LOG|pebbleId=|text=

##### Example Usage
	opCode=FA_LOG|pebbleId=8080477D|text=displayed hint "go west"

where

* `gameId` is the game number.
* `pebbleId` is the name of the team.
* `text` is *text* of up to 140 chars.

##### Recipient Actions
Upon receipt of this message, the Game Server shall ignore it.


#### `GA_STATUS` {#ga-status}

The Guide Agent (GA) joins the game by sending its first periodic status message.
In this status message, it can also request to receive an update from the GS regarding the status and state of the game by setting a flag in the fomatted message it sends to the GS.

##### General Format
	opCode=GA_STATUS|gameId=|guideId=|team=|player=|statusReq=

##### Example Usage
	opCode=GA_STATUS|gameId=FEED|guideId=0707|team=aqua|player=Alice|statusReq=1

where

* `gameId` is the game number, or 0 when GA is just starting.
* `guideId` is the guide identifier.
* `team` is the name of the team to which the GA belongs.
* `player` is the name of the GA player.
* `statusReq` is a boolean flag indicating if the GA would like to receive a game status update (1 = "request update", 0 = "no update").

##### Recipient Actions
Upon receipt of this message, the Game Server shall

* validate the message fields; ignore the message if anything is invalid.
* if `gameId == 0`,
	* and `team` is not known, register `team`
	* and `guideId` is not known, register `guideId` and associate it with given `player` and `team` names.
	* and `guideId` is known, verify that `team` matches a known `team` and associate `guideId` with given `player` name.
	* respond with a [`GAME_STATUS`](#gs-status) message to let the Guide Agent now that they have successfully joined the game

* if `gameId != 0`,
	* validate the `gameId`, `guideId`, `team`, and `player`, as above.
	* update records regarding last-contact-time of this Guide Agent.
	* if `statusReq=1`, send a [`GAME_STATUS`](#gs-status) message back to the Guide Agent.

In either case, if there are invalid fields or values that don't match expectations (for example, a GA changes teams), send the relevant [response code](#response-codes) and ignore the message.


#### `GA_HINT` {#ga-hint}

To assist Field Agents in their game play, the GA requires a mechanism that enables the Guide to send textual *hints* to its FAs.

##### General Format
	opCode=GA_HINT|gameId=|guideId=|team=|player=|pebbleId=|hint=

##### Example Usage
	opCode=GA_HINT|gameId=FEED|guideId=0707|team=aqua|player=Alice|pebbleId=8080477D|hint=Bob, look inside the cafe!

where

* `gameId` is the game number.
* `guideId` is the guide identifier.
* `team` is the name of the team to which the GA belongs.
* `player` is the name of the GA player.
* `pebbleId` is the FA to which a hint will be sent, which must correspond to a player (a Pebble) on the GA's team; alternately `pebbleId` may be `*` to "broadcast" the hint to all FAs on the GA's team.
* `hint` is *text* of up to 140 chars.

##### Recipient Actions (GS)
Upon receipt of this message, the Game Server shall

* validate the `gameId`, `guideId`, `team`, and `player`, as above.
* validate that `pebbleId` is `*`, or a known player on the GA's team. (if invalid, ignore this message.)
	* if `pebbleId` is `*`, send this complete message, unchanged, to all FAs on GA's team.
	* otherwise, send this complete message, unchanged, to the named FA.
* update records regarding last-contact-time of this Guide Agent.

If there are invalid fields or values that don't match expectations (for example, a GA changes teams), send the relevant [response code](#response-codes) and ignore the message.

##### Recipient Actions (FA)
Upon receipt of this message, the Field Agent shall

* validate the message fields; ignore the message if anything is invalid.
* store the hint in memory for display to the player.
* notify the player about the arrival of a new hint.

The design of a user interface for display of hints (current and past) is up to you to design.


#### `GAME_STATUS` {#gs-status}

This message is sent by the Game Server to either a Field Agent or Guide Agent upon request for a status update (as indicated by the `statusReq` field).

Whenever the GS sends a `GAME_STATUS` message to a GA, it immediately sends the GA a [`GS_AGENT`](#gs-agent) message **for each** FA on the GA's team.

##### General Format
	opCode=GAME_STATUS|gameId=|guideId=|numClaimed=|numKrags=

##### Example Usage
	opCode=GAME_STATUS|gameId=FEED|guideId=0707|numClaimed=5|numKrags=8

where

* `gameId` is the game number.
* `guideId` is the identifier of this team's Guide Agent, or 0 if not yet known.
* `numClaimed` is the number of krags claimed by the Agent's team.
* `numKrags` is the total number of krags.

##### Recipient Actions
Upon receipt of this message, the Agent shall

* validate the message fields; ignore the message if anything is invalid.
* update its internal records about the state of the game.


#### `GS_AGENT` {#gs-agent}

When the GS receives a `statusReq` from a GA, it shall send a [`GAME_STATUS`](#game-status) message followed by one `GS_AGENT` message to the GA **for each** FA on the GA's team.

##### General Format
	opCode=GS_AGENT|gameId=|pebbleId=|team=|player=|latitude=|longitude=|lastContact=

##### Example Usage
	opCode=GS_AGENT|gameId=FEED|pebbleId=8080477D|team=aqua|player=Alice|latitude=43.706552|longitude=-72.287418|lastContact=28

where

* `gameId` is the game number.
* `pebbleId` represents the specific Pebble device.
* `team` is the name of the team to which the FA belongs.
* `player` is the name of the FA player.
* `latitude` is the last known latitude of the FA's position.
* `longitude` is the last known longitude of the FA's position.
* `lastContact` is the number of seconds since the GS last received a message from the FA

##### Recipient Actions
Upon receipt of this message, the Guide Agent shall

* validate the message fields; ignore the message if anything is invalid.
* update the associated FA's information


#### `GS_CLUE` {#gs-clue}

After a Field Agent successfully locates a krag, the Game Server may send one or more clues to that team's Guide Agent.
The Guide Agent shall not show the kragId to its player; it is provided here for later matching with a future [`GS_CLAIMED`](#gs-claimed) message.

##### General Format
	opCode=GS_CLUE|gameId=|guideId=|kragId=|clue=

##### Example Usage
	opCode=GS_CLUE|gameId=FEED|guideId=0707|kragId=07E1|clue=A stone building for religious services, under the third archway.

where

* `gameId` is the game number.
* `guideId` is the guide identifier.
* `kragId` is the krag identifier (for bookkeeping, not for display).
* `clue` is the randomly chosen clue that the Game Server is sending the Guide Agent.

##### Recipient Actions
Upon receipt of this message, the Guide Agent shall

* validate the message fields; ignore the message if anything is invalid.
* update records regarding known clues

#### `GS_CLAIMED` {#gs-claimed}

After a Field Agent successfully locates a krag, the Game Server shall send this message to that team's Guide Agent.
This message allows a Guide Agent to know that the clue corresponding to this `kragId` has been claimed and thus, for example, could be removed from the list of unsolved clues.
The message carries the krag's location, allowing the Guide Agent to display the claimed krag on a map.

##### General Format
	opCode=GS_CLAIMED|gameId=|guideId=|pebbleId=|kragId=|latitude=|longitude=

##### Example Usage
	opCode=GS_CLAIMED|gameId=FEED|guideId=0707|pebbleId=8080477D|kragId=07E1|latitude=43.706552|longitude=-72.287418

where

* `gameId` is the game number.
* `guideId` is the guide identifier.
* `pebbleId` is the identifier of the pebble claiming this krag.
* `kragId` is the identifier of the krag that was claimed.
* `latitude` is the latitude coordinate of the krag associated with the clue.
* `longitude` is the longitude coordinate of the krag associated with the clue.

##### Recipient Actions
Upon receipt of this message, the Guide Agent shall

* validate the message fields; ignore the message if anything is invalid.
* update records to note that the clue corresponding to the given krag has been solved and krag claimed.


#### `GS_SECRET` {#gs-secret}

The Game Server sends a copy of the hacker's secret to a Guide Agent, with some characters revealed, after a Field Agent successfully locates a krag.

##### General Format
	opCode=GS_SECRET|gameId=|guideId=|secret=

##### Example Usage
	opCode=GS_SECRET|gameId=FEED|guideId=0707|secret=com_____ _cie____50

where

* `gameId` is the game number.
* `guideId` is the guide identifier.
* `secret` is the hacker's secret, with characters revealed after each krag is claimed; read [about reveal](#reveal) above.
In the example above 9 characters (including a space) have been revealed from the secret `computer science 50`.

##### Recipient Actions
Upon receipt of this message, the Guide Agent shall

* validate the message fields; ignore the message if anything is invalid.
* update its display to present the new secret to the player.


#### `GS_RESPONSE` {#gs-response}

For debugging and convenience the Game Server shall respond to various conditions via this message.

##### General Format
	opCode=GS_RESPONSE|gameId=|respCode=|text=

##### Example Usage
	opCode=GS_RESPONSE|gameId=0707|respCode=SH_ERROR_INVALID_OPCODE|text=Unrecognized opCode 'GA_FOO'

where

* `gameId` is the game number.
* `respCode` is one of the response codes below.
* `text` is human-readable *text* that you are free to define as you see fit (max 140 chars).

##### Recipient Actions
Upon receipt of this message, the Agent

* validate the message fields; ignore the message if anything is invalid.
* optionally takes some recovery action based on the response code.

#### `GAME_OVER` {#gs-over}

When the game ends, the GS should first send all Agents (all FAs and all GAs) a [`TEAM_RECORD`](#team-record) message **for each** team known to the GS.
Afterwards, the GS should send the message described below.

##### General Format
	opCode=GAME_OVER|gameId=|secret=

##### Example Usage
	opCode=GAME_OVER|gameId=FEED|secret=computer science 50 rocks!

where

* `gameId` is the game number.
* `secret` is the fully revealed secret string

##### Recipient Actions
Upon receipt of this message, the Agent (program) notifies its player (human) that the game is over and reports (in some suitable format) the overall game results, and the fully revealed secret.
The Guide Agent should then exit.


#### `TEAM_RECORD` {#team-record}

When the game ends, the GS should send one `TEAM_RECORD` message to every player (all FAs and all GAs) **for each** team known to the GS, followed by a [`GAME_OVER`](#game-over) message.

##### General Format
	opCode=TEAM_RECORD|gameId=|team=|numClaimed=|numPlayers=

##### Example Usage
	opCode=TEAM_RECORD|gameId=FEED|team=aqua|numPlayers=4|numClaimed=8

where

* `gameId` is the game number.
* `team` is the name of the team.
* `numPlayers` is the number of players on that team.
* `numClaimed` is the number of krags that the team has claimed.

##### Recipient Actions
Upon receipt of this message, the Agent should store the information contained in this message, and prepare to display it upon receiving a [`GAME_OVER`](#game-over) message.

-------------------------------------------------------------------------

### Response Codes {#response-codes}

The following values may be used in the `respCode` field of a message with [`opCode=GS_RESPONSE`](#gs-response).

#### `SH_ERROR_INVALID_MESSAGE` {#sh-error-invalid-message}
An error code sent by the Game Server to any type of Agent if an invalid message is received.

#### `SH_ERROR_INVALID_OPCODE` {#sh-error-invalid-opcode}
An error code sent by the Game Server to any type of Agent if an invalid `OPCODE` is sent as part of a message.

#### `SH_ERROR_INVALID_FIELD` {#sh-error-invalid-field}
An error code sent by the Game Server to any type of Agent if an invalid `fieldName` is sent as part of a message.

#### `SH_ERROR_DUPLICATE_FIELD` {#sh-error-duplicate-field}
An error code sent by the Game Server to any type of Agent if a duplicate `fieldName` is sent as part of a message.

#### `SH_ERROR_INVALID_GAME_ID` {#sh-error-invalid-game-id}
An error code sent by the Game Server to any type of Agent if an invalid `gameId` is sent as part of a message.

#### `SH_ERROR_INVALID_TEAMNAME` {#sh-error-invalid-teamname}
An error code sent by the Game Server to any type of Agent that sends a `team` that is either syntactically invalid or not identical to the `team` used by this Agent in prior communications.

#### `SH_ERROR_INVALID_PLAYERNAME` {#sh-error-invalid-playername}
An error code sent by the Game Server to any type of Agent that sends a `player` that is either syntactically invalid or not identical to the `player` used by this Agent in prior communications.

#### `SH_ERROR_DUPLICATE_PLAYERNAME` {#sh-error-duplicate-playername}
An error code sent by the Game Server to a Field Agent that sent an `FA_LOCATION` message in an attempt to register a `player` name that already exists on the given team.

#### `SH_ERROR_INVALID_ID` {#sh-error-invalid-id}
An error code sent by the Game Server to any type of Agent that sends an ID (`guideId` or `pebbleId`) that is either syntactically invalid or not one used by any Agent in prior communications.
(Note, of course, that a fresh ID is always expected, and accepted, in an `FA_LOCATION` or `GA_STATUS` message with `gameId == 0`, because that's how a new Guide or Field Agent joins the game).

#### `SH_CLAIMED` {#sh-claimed}
A response by the Game Server to a Field Agent in response to a successfully claiming a krag.

#### `SH_CLAIMED_ALREADY` {#sh-claimed-already}
A response by the Game Server to a Field Agent in response to an attempt to claim krag that has already been claimed by this team.

-------------------------------------------------------------------------

## krag file format {#kff-format}

This file contains the list of krags, one per line.
You may assume this file is correctly formatted, as follows:
Each line has the format

```
latitude=|longitude=|kragId=|clue=
```

where `latitude` and `longitude` are both decimal numbers that can be read into a floating-point variable, `kragId` is a 4-digit *hex code*, and `clue` is the *text* providing a clue for locating the krag (max length 140 chars).

For example,

```
latitude=43.706552|longitude=-72.287418|kragId=86DA|clue=It has a million stories, but cannot tell them.
```

We will soon set up krags around campus, within the range of [this map](imgs/campus-map.png), and provide a krag file, but we may use a different set of krag locations for testing.
You are welcome to test with your own krag file as well.


-------------------------------------------------------------------------

## Secret file format {#secret-format}

This file contains the secret string, on one line.
You may assume that it conforms to the format required of a secret (*text* of at most 140 characters).
Furthermore, the length of this string *(n)* may be assumed to be greater than the number of krags *(k)*, as needed for the [reveal](#reveal).
Thus, you may assume *1 < k <= n <= 140*.

-------------------------------------------------------------------------

## Log file format {#log-format}

Log files are a useful way to record the flow of a component's activity, particularly for testing and debugging.
They are also play a critical role in our testing of your submitted solution.

Your Game Server shall write well-structured logging messages to the file `logs/gameserver.log`.

Your Guide Agent shall write well-structured logging messages to the file `logs/guideagent.log`.

Your Field Agents cannot write log files, but the Unix-side proxy does print its message traffic.
You shall save that log output in file `logs/fieldagents.log`.
Your Pebble app can log additional information by sending a [`FA_LOG`](#fa-log) message to the Game Server.

Your applications shall log:

* every inbound message, exactly as it arrived
* every outbound message, exactly as it arrived

Your application may optionally log other information you find useful, as long as you follow the format below.

**NOTES:**

* You shall create these files in a `logs/` directory and ensure that this directory is not committed to your repo (i.e., add `logs` to your `.gitignore`).
* Because your program needs to create these log files every time you start up a new game or agent, we recommend you launch a new game with a bash script that creates a `logs` directory, if needed; if `logs` exists, you may want to rename or remove its contents.
* Use the code below to generate timestamps

	```c
	/* Include time.h to use time() and ctime(). Note that ctime() puts *
	 * '\n' on the end of its return string, but I overwrite it with    *
	 * ')' so that the rest of the log message is on the same line.     */
	char timestamp[27];
	time_t clk = time(NULL);
	sprintf(timestamp, "(%s", ctime(&clk));
	timestamp[25] = ')';
	```

### Inbound Message

You shall log every inbound message.

##### General Format

```
(timestamp) FROM IP@PORT: message
```

##### Example Usage

```
(Mon May  8 10:47:12 2017) FROM 129.170.214.115@34255: opCode=GA_HINT|gameId=FEED|guideId=0707|team=aqua|player=Alice|pebbleId=8080477D|hint=head west
```


### Outbound Message

You shall log every outbound message.

##### General Format

```
(timestamp) TO IP@PORT: message
```

##### Example Usage

```
(Mon May  8 10:47:13 2017) TO 129.170.214.115@23855: opCode=GA_HINT|gameId=FEED|guideId=0707|team=aqua|player=Alice|pebbleId=8080477D|hint=head west
```


### Other

You are free to log other information.
The content and format after `NOTE: ` is up to you, as long as it includes no newlines.

##### General Format

```
(timestamp) NOTE: information
```

##### Example Usage

```
(Mon May  8 10:47:13 2017) NOTE: displayed hint "head west"
```

-------------------------------------------------------------------------
