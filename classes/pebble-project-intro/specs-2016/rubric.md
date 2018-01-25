--- 
layout: page
title: Mission Incomputable rubric
---

This is an *initial rubric* and, while I don’t expect it to change, I reserve the right to update it based on things that come up after posting the rubric. 

# Grading

Recall [grade breakdown](index.html#grading):

* 15 points: Design spec
* 10 points: Implementation spec
* 10 points: Code style and quality
* 10 points: Client presentation
* 35 points: Base functionality
* 0+ points: Extended functionality (see [list](mission.html#base-and-extensions))
* -10 points: any segfault (there will be no opportunity to fix and resubmit)

# Design (15 points)

The overall design is rather fixed - Field Agent (Pebble), smartphone Proxy (provided), Unix Proxy (provided), Game Server, and Guide Agent.  We focus attention on the student-written components.

## Game Server (5 points)

* main loop and overall flow
* data structure to represent players and code drops
* user interface 
* functional decomposition into modules
    * *message*, which parses incoming messages and provides wrapper routines for constructing/sending messages to players.
    * *list* or *hashtable* of players (field agents and guide agents)
* which extensions? and how do they affect overall design

## Guide Agent (5 points)

* main loop and overall flow
* handling stdin as well as socket
* data structure to represent players and code drops
* user interface
* which extensions? and how do they affect overall design

## Field Agent (5 points)

* main loop and overall flow
* functional decomposition into modules
* data structure to represent game state
* user interface
* which extensions? and how do they affect overall design
 
# Implementation plan (10 points)

* 1 = delivery (`IMPLEMENTATION.md`)
* 3 = Game Server (plan, pseudo code, data structure)
* 3 = Guide Agent (plan, pseudo code, data structure)
* 3 = Field Agent (plan, pseudo code, data structure)


# Code style and quality (10 points)

* clear and consistent style, per [CS50 coding standards](http://www.cs.dartmouth.edu/~cs50/Resources/CodingStyle.html)
* clear code design, functional decomposition, naming
* clear code logic and flow
* good choice of, and use of data structures* in-code documentation (comments)
* other documentation: IMPLEMENTATION.md* clear Makefile/scripts for build, test, and run* defensive programming (error checking, malloc, etc.)* no memory leaks caused by student code
* appropriate use of git
	* (all students use git, good commit msgs, etc.)
	* view `git log --decorate --graph --pretty=medium`

# Client presentation (10 points)

See *[Client presentation](http://www.cs.dartmouth.edu/~cs50/Labs/Project/#client-presentation)* in project spec.

* 1 organized and efficient; provide printed copies for Dave and Travis
* 1 all members have meaningful role
* 1 list what extensions are supported and how
* 1 list known limitations of current implementation
* 6 demo
	* Pebble
	* GameServer
	* Guide Agent

# Base functionality (35 points)

The `TESTING.md` file here is ***vitally important*** to help us verify functionality.  Your file should indicate (a) where in the code we can see that functionality implemented, and (b) how you tested to verify that the functionality works.

* 10 Field Agent
	* periodic location updates.
	* neutralizing a code drop
	* capturing another player.
	* receive and display hints.
	* receive and display capture code.
	* receive notice of capture.
	* UI to choose from a list of player names
	* UI for game status
	* UI for game over
* 7 Guide Agent
	* command line
	* send periodic update to GS
	* receive updates about players
	* receive indications status of code drops
	* send hints to a given player
	* basic display of game status
	* logging
* 18 Game Server
	* command line
	* read code drops from file
	* create and manage socket
	* ignore messages for wrong game number
	* accept new Agents, and respond with game number.
	* ignore messages from new Guide Agents who declare a team for which there is already a Guide Agent.
	* forward hints from the Guide to FA or *.
	* receive/handle a request to neutralize
	* receive/handle a request to capture
	* send notice of ‘captured’.
	* track the status of all code drops.
	* track the location and status of all players on all teams.
	* track game statistics: elapsed time, number of active agents, number of active teams, number of code drops neutralized by each team, number of code drops yet to neutralize.
	* present a textual (or graphical) summary of game status on the terminal.
	* send game-status updates to FA: game statistics; not including any location information.
	* send game-status updates to GA, on request, including game statistics; location and status of all code drops; location, name, team, and status of all field agents.
	* recognize end of game; send game-over message.
	* logging


# Extended functionality

See [list](mission.html#base-and-extensions)

# Segfault (-10 points)

* Any segfault in any program at any time, if triggered by student code.