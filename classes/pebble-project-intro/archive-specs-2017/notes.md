# Project KRAG

## notes for the future

### misc

* share the [tips](tips.html) with students; link from index.html?

* structure the starter kit so there are three common library directories: libcs50 (already cleaned for game and pebble use), pcommon (shared with pebble), and common (not shared with pebble); but perhaps pick better names.

* a top-level Makefile is tricky because it needs to behave differently on the Mac (where it is possible to `pebble build`) and on Linux (where it is not).   Work out a solution and update the assignment with clearer instructions and better hints.

* make sure the starter kit is consistent with the assignment and specs; I think it refers to the game by an old name.

* starter kit could better explain (and demonstrate) use of NOPEBBLE

* think about how to handle concurrency between ncurses and sockets, and be sure to give hints that help them address this challenge. May need to adjust the chatserver/client code to make it easier to adapt for the guideagent.

* be clear whether it is `game-server` or `gameserver`, etc.

* socket examples could be redesigned to make it easier to adapt the relevant pieces of code for use in the game; guide-agent needs clientsocket and game-server needs serversocket.

### Rubrics

* the functionality rubric should include points for `TESTING.md`
* the penalty rubric should include points off for leaving on debug prints


### index.md

* see notes about the rubric in the overall course notes.

* fold all the "Updates" into the assignment.

* add hint about use of `fflush`, esp for log files.
* add hint about `tail -f` for log files.
* remove hint about enums for opcodes; I'm not sure it helps.

* Clarify what is required in the implementation spec, notably, how much pseudocode and which function(s) need to have pseudocode.

### REQUIREMENTS.md

* fold all the "Updates" into the spec.
* clarify exactly what the kind of input is expected to the Game Server and Guide Agent; some teams thought it should allow the player to enter fully-formatted protocol strings(!).  instead, spec the "game over" input to game server and the "hint" input for guide agent (with alternative for curses).
* indeed, clarify that the players of this game are not CS50 students, nor developers.  there should be no debugging inputs or outputs.
* clarify that players should *not* have to explicitly ask for game status.
	* the intent of the status-request option is to give the agents some control over when to ask for game status, but not to pass this flexibility (let alone requirement) on to the player.
* how to handle Agents that restart and rejoin the game?  see [piazza](https://piazza.com/class/izsl3qrp6l86gp?cid=434).
	* I expect the current protocol is not up to the task;  it would require careful analysis and refinement, and even more careful implementation  Instead, seek clarity about how to keep rebooting agents from getting back in and confusing the game.
* remove all 'distance' features of the game.  GPS is too flaky to allow rigorous checking of distance, e.g., to limit FAs from claiming a krag unless they are within 10m of the krag.

* change the definition of hex codes... the goal was to make it easy to parse with `sscanf("%x")` but that leaves tricky question about what "four-digit hex code" means.  I resolved it.  But many groups want to use kragId or pebbleId as a key for a set or hashtable, which need string keys... so maybe it's easier to just make these keys strings (not integers) and they can be hex or, for that matter, alphanumeric.

* the lack of `sscanf` on the pebble makes it hard to parse some of the message fields. think carefully.
