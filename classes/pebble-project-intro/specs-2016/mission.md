---
layout: page
title: Mission Incomputable
---
## Updates

 * 5/18: Game Server and Guide Agent must each produce a [logfile](#log-files).
 * 5/19: Optional: allow input from terminal user to end the game early.
 * 5/19: What Game Server should do when the game ends.
 * 5/19: Added a new 'extension' about *When a Field Agent comes within 50m of a code drop or other Field Agent...*.
 * 5/20: Clarify that Game Server does not send explicit notifications of changes in game state like new players, players captured, code drops neutralized, and so forth; the Field Agents and Guide Agents must infer those events from changes in the game status (as received in `GAME_STATUS` messages).
 * 5/21: Regarding the [extension](#base-and-extensions) where the Field Agent code uses the accelerometer API to save energy; we clarify that the Field Agent should *regularly* send its location update to the Game Server regardless of whether or not its actual location is changing; the Field Agent only needs to request a new location from the companion smartphone if it determines it has moved sufficiently and its location is likely to have changed.  
 * 5/26: new command-line format for gameserver and guideagent
 * 5/30: added extra points for use of ascii-art game summary in Guide Agent.

The setting
-------------

S&S has recently learned that some of its rogue agents have stolen copies of the source code for the *Tiny Search Engine*, and have distributed them at secret [dead drop](https://en.wikipedia.org/wiki/Dead_drop) locations around campus.  We anticipate that operatives from Dartmouth's fiercest competitors will soon reach these locations.  As you know, the TSE is Dartmouth's most valuable technology, and we must retrieve every page before those operatives get their hands on it.

***Your mission***, *should you choose to accept it,* is to track down every code drop and *neutralize* each page of code. Fortunately, every page of TSE code has been bugged with a tracking device, making it possible for field agents like you to seek and discover the code drops.  You will be issued a highly sophisticated piece of spycraft, cleverly disguised as a *[Pebble smartwatch](https://www.pebble.com/buy-pebble-time-smartwatch),* that allows a field agent to seek and find code drops with guidance from a hacker, er, guide agent (aka, *[Luther](https://www.youtube.com/watch?v=zv2l0VEPQUE))*.  When a code page is found, it can be neutralized with your spy watch.

Field agents ... wait! Before you grab that Pebble and run off to find that code, be warned that Harvard's operatives may already be on campus.  If they *capture* you, you won't be able to help neutralize the code drops!  Fortunately, your guide has technology to track the operatives, and can guide you to capture *them* instead. 

Guides, you'll be able to track your field agent(s) and guide them to the code drops.  We've already hacked the Harvard's satellites, so you can also track the operatives and guide your field agent(s) to capture them.  (The catch: we believe Harvard has also found ways to track our agents.)

> (With apologies to *[Mission Impossible](https://en.wikipedia.org/wiki/Mission:_Impossible_(film)).* :)

Rules
------------

This mission, despite its colorful introduction, is a game of cooperation and competition. Here are the rules of the game.

There are one or more teams.
 
 * In a game with one team, the team's goal is to find all code drops. No other team is in competition, and there is no opportunity to capture or be captured.

 * In a game with two or more teams, each team's goal is to find all code drops, while avoiding capture and (when possible) capture other teams' players.

New teams may join at any time during the game.

 * New players may join at any time during the game, specifying their team.
 * If the specified team is new to the game, the game now has one more team.
 * Once joined, a player cannot switch teams.

Each team has two kinds of player: one *guide* and one or more *field agents*.   

 * The *guide* uses a laptop application to view the overall game status, and can send hints to the team's field agents.
 * The *field agents* wear a Pebble and run around campus, seeking to find code drops, or find and capture field agents from other teams.  They try to avoid being captured.


A *code drop* is a piece of paper, posted in a public space, with a 4-digit hex code printed on the paper. A code drop is *neutralized* when the field agent is close enough to read the code and correctly enter that code on her Pebble screen. Once a code drop has been *neutralized*, no other team can find it.  (As you play, though, please leave the paper in place for future iterations of the game.)

A *capture* occurs when one field agent spots another team's field agent, and taps the "capture" button on her own Pebble.  All opposing agents nearby will display a 4-digit hex code on their screen; the capturing player asks the captured player for the displayed code, and enters it on her own Pebble screen. If the code is correct, the captured player is removed from the game.  (The Game Server will keep a record of that player, but simply mark it as 'captured' and ignore any further messages from that player during this game.)
 
The *game ends* when all code drops have been found; or, OPTIONALLY, when the terminal user provides input to end the game early.

For those who feel a game needs a winner, the winning team is the one that finds the most code drops. 


Components
--------------

### Field agent

The Field Agent app *shall*

* Run on the Pebble; see the [Pebble](pebble.html) page.
* Play according to the above rules of the game.
* Communicate (indirectly) with the Game Server via [protocol](protocol.html) to 
	 * send the Game Server the player's current location four times per minute.
	 * inform the Game Server when this player neutralizes a code drop  (by providing a 4-digit hex code).
	 * inform the Game Server when this player has captured another player (by providing a 4-digit hex code).
	 * receive from Game Server hints from the Guide Agent.
	 * receive from Game Server 4-digit hex code indicating this Field Agent is target of capture.
	 * 	receive from Game Server indication that this Field Agent has been successfully captured.
* Present a suitable interface, of your own design, to allow the player to
	 * choose from a preconfigured list of player names, and join a game as that player.
	 * present hints from the Guide Agent.
	 * allow player to "neutralize" code drop by entering 4-digit hex code and uploading to Game Server.
	 * allow player to initiate "capture" of nearby opposing player; then, to enter 4-digit hex code and uploading to Game Server.

### Guide agent

The Guide Agent application *shall*

* Run on a CS50 Unix server (though for testing you may run it on your laptop).
* Accept and validate four command-line arguments: 
	 * `./guideagent [-v|-log=raw] [-id=########] teamName playerName GShost GSport`, that is,
	 * verbose logging mode (see [below](#log-files))
	 * the `guideId`,
	 * the team name,
	 * the player name,
	 * Game Server host (hostname or IP address),  and
	 * Game Server port number.

	 > Your guideagent may also accept other switches, e.g., to enable special features in your game.
	> Your guideagent should print a warning about unrecognized switches, but otherwise ignore them.
	> You must implement the four mandatory parameters.
	> You are not required to implement any/all of the switches.

* Play according to the above rules of the game.
* Communicate with the Game Server via the [protocol](protocol.html) to 
	 * receive updates about the current location and status of players on guide's team
	 * receive indications about the current location and status of other team's players
	 * receive indications about the location and status of code drops
	 * ask it to send hints to a given player.
 * Present a suitable interface, of your own design, to allow the Guide to 
	 * see the current status of each player on Guide's team
	 * choose a player and send a hint to that player (a *hint* is 140 printable characters, excluding the pipe `|` symbol). 

* Log all its activity to a [logfile](#log-files).

* Exit when the game ends.


### Game Server

The Game Server application coordinates one (and only one) game each time it runs.  It *shall*

* Run on a CS50 Unix server (though for testing you may run it on your laptop).
* Accept and validate command-line arguments: 
	 * `gameserver [-v|-log=raw] [-game=####] codeDropPath GSport
`, that is,
	 * 	verbose logging mode (see [below](#log-files)),
	 * `gameId` number,
	 * the pathname for the code-drop file, and 
	 * Game Server port number.
	 
	 > Your gameserver may also accept other switches, e.g., to enable special features in your game.
	 > Your gameserver should print a warning about unrecognized switches, but otherwise ignore them.
	 > You must implement the two mandatory parameters.
	 > You are not required to implement any/all of the switches.
	 
* Read a list of code drops from a file; see [format](protocol.html#code-drop-file).
* Create a DGRAM socket and bind it to the given port number; exit on any failure.
* Pick a random game number [1..65535] for the new game.
* Coordinate game according to the rules above.
* Communicate with Field agents via [protocol](protocol.html) to
	 * 	ignore all messages that refer to a game number different than the game in progress.
	 * accept new Field Agents, and respond with game number.
	 * forward hints from the Guide.
	 * notice of 'maybe-captured', with code, as below.
	 * notice of 'captured', as below.
	 * send game-status updates, on request, including 
		 * status about the team's guide.
		 * status of all Field Agents on this team. 
		 * game statistics: elapsed time, number of active agents, number of active teams, number of code drops yet to neutralize.
		 * *not* including any location information. 

* Communicate with Guide agents via [protocol](protocol.html) to
	 * ignore messages that refer to a game number different than the game in progress.
	 * accept new Guide Agents, and respond with game number
	 * ignore messages from new Guide Agents who declare a team for which there is already a Guide Agent.
	 * receive requests to forward a hint to a given teammate, and send that hint to that teammate.
	 * send game-status updates, on request, including
		 * game statistics: elapsed time, number of active agents, number of active teams, number of code drops yet to neutralize.
		 * location and status of all code drops.
		 * location, name, team, and status of all field agents.

* Track the status of all code drops.
	 * The status is either 'active' or 'neutralized'.

* Track the location and status of all players on all teams.
	 * locations are represented as latitude/longitude.
	 * status is 'active', 'capturing', 'maybe-captured', or 'captured'.
	 * receive from Field Agents a request to neutralize a code drop, and respond with indication of whether neutralization was successful; where success = code drop has not already been neutralized by a different player.
	 * receive from Field Agents a request to capture a nearby agent; if the Field Agent's status is 'active', it enters status 'capturing' for the next 60 seconds, and any other 'active' opposing players within 10m enter status 'maybe-captured' for the next 60 seconds; send a different random 4-digit hex code to those players just marked 'maybe-captured'.*
    * receive a 4-digit hex code from a capturing Field Agent; if it matches the code sent to another agent X, and the code was sent no more than 60 seconds prior, send X a notification that it has been captured, and mark X with status 'captured'; future messages from X are ignored.

* Track game statistics: 
	 *  elapsed time, number of active agents, number of active teams, number of code drops neutralized by each team, number of code drops yet to neutralize.

* Present a textual (or graphical) summary of game status on the terminal, updating the summary as the game evolves.  The game status includes status of each code drop (location, status) and field agent (location, direction, status), and statistics.

* Log all its activity to a [logfile](#log-files).

* End the game when all code-drops have been neutralized.  (OPTIONAL: allow user at terminal to indicate that the game should end early.)  When the game ends, send a game summary to all players, then exit.

> *When computing distance between two lat/long points, you may use simple Euclidean distance calculations (think of the Pythagorean Theorem).  (A proper calculation is much more complicated; see one of the extensions below.)


## Base and extensions

The above specifications represent the *base functionality*, which are required of all solutions.  

Your solution will score additional points (see [Grading](index.html#grading)) if it supports any of the following extensions.
 ***Teams with four students must complete 5 points from the menu below as part of their 'base functionality'.***

 * ***5 points***: Game server outputs an ascii-art game summary, that is, filling the terminal window with regular (ASCII) characters that somehow represent the game status. You may find the [curses](https://en.wikipedia.org/wiki/Curses_%28programming_library%29) library useful.
 * ***5 points***: Guide Agent outputs an ascii-art game summary, as above.  *(Limited to 3 points if your game server also provides ascii-art view; hopefully they can use common code.)*
 * ***10 points***: Game server provides a graphical game summary, e.g., displaying a marker for each code drop and each player, overlaid on a campus map. You may find the [gtk](http://www.gtk.org) package useful; see [instructions]({{site.resources}}/XQuartz). 
 * ***10 points***: Guide Agent provides a graphical game summary, e.g., displaying a marker for each code drop and each player, overlaid on a campus map. You may find the [gtk](http://www.gtk.org) package useful;  see [instructions]({{site.resources}}/XQuartz).  *(Limited to 5 points if your game server also provides a graphical view; hopefully they can use common code.)*
 * ***5 points***: A "Level 2" game, in which the game server sends the Guide coordinates only for field agents on the Guide's team; for each field agent, it provides two pieces of information for each code drop and opposing agent, specifically, the direction and approximate distance: *near* (<10m), *close* (<100m), and *far*.
 * ***5 points***: A "Level 3" game, in which the game server sends the Guide the coordinates for *only* those code drops and opposing agents who are within 100m of the current location of any Field Agents on the Guide's team.  Field Agents will need to explore widely to find undiscovered code drops.
 * ***5 points***: Use the Pebble's accelerometer API to detect when the Field Agent is *stationary* or *moving*, requesting location updates from the companion smartphone less-frequently when stationary. Using GPS to determine your location consumes quite a bit of energy so the purpose of this extension is to save energy. Regardless of your location changing (or not), the Pebble should still report its location (`FA_LOCATION`) as described above so that the Game Server/Guide Agent can be assured that the Field Agent is still actively participating in the game.
 * ***5 points***: Use the Pebble's compass API to send information about the Field Agent's heading to the Guide, who can display and use that information in planning.  Caveat: we are unsure about the accuracy of Pebble's magnetometer.
 * ***4 points***: Use the Pebble API to collect statistics about step-count and calories-burned, reporting that information to Game Server periodically. 
 * ***2 points***: Run games for a given duration; the game server's status updates inform all players about time remaining in the game. When time runs out, all players are notified of the game-end and final statistics.
 * ***3 points***: Compute the distance between two lat/long points with the proper [equations](http://www.movable-type.co.uk/scripts/latlong.html), allowing the game to be played over much larger distances than our little campus.
 * ***5 points:*** When a Field Agent comes within 50m of a code drop or other Field Agent, the Game Server sends that Field Agent the coordinates of those nearby code drops and agents (friends or foes).  It's as if the Pebble had a kind of 'radar' sensing capability.  The challenge here is to present that information to the player in an interesting UI so they can take action.
 * ***10 points***: Enhance the Field Agent user interface; consider these  [Common design styles](https://developer.pebble.com/guides/design-and-interaction/recommended/#common-design-styles).  You may find it useful to explore these [examples](https://developer.pebble.com/guides/design-and-interaction/implementation/) - but remember to cite any code you borrow.

## Log files

Log files are a useful way to record the flow of a component's activity, particularly for testing and debugging.

### Game Server & Guide Agent

Your Game Server should write well-structured logging messages to the file `gameserver.log`.

Your Guide Agent should write well-structured logging messages to the file `guideagent.log`.

Both your Game Server and Guide Agent applications should support two logging modes: 'game' mode (the default) and `raw` mode (more verbose). 
 
> You may make the selection at compile time with #ifdef or at run-time through an optional command-line parameter, e.g.:
> `./guideagent [-log=raw] ...`
> `./gameserver [-log=raw] ...`

In *game mode* (the default), your application shall only log updates on start-up information and relevant game state (e.g., host/port where server is running, new player joins, player captured, code drop neutralized). The specifics are up to you and your implementation but you should at least capture the above game-state elements.

In *raw mode*, your application shall also log the inbound and outbound message strings. You should also include a timestamp for when these messages arrive/depart.


**NOTES:** 

* Since these are generated files, you might consider creating them in a `log/` directory and ensuring that the contents of that file are not committed to your repo (i.e., add `gameserver.log` and `guideagent.log` to your `.gitignore`!).
* Because your program creates these log files every time you start up a new Game Server or Guide Agent strongly suggests that you might want your `Makefile` or bash script to rename the log file to some suitably named file before you run the server again. Just saying...
* Depending on how long you run your applications, these log files could become quite large! Please don't leave your Game Server and/or Guide Agent running unnecessarily (i.e., when you aren't actively working/debugging).

### Field Agent

No explicit log files are necessary. It will be helpful to you and the graders, however, if you do use the Pebble logging mechanisms to log significant information that can be observed while your Pebble app is running. What you log is ultimately up to you.


## End.