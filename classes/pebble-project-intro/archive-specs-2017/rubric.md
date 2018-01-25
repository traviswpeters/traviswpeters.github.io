---
layout: page
title: Project rubric
---

This is an *initial rubric* and, while I don’t expect it to change, I reserve the right to update it based on things that come up after posting the rubric.
This page provides detail on the [grade breakdown](index.html#grading).

## Design (15 points) {#design}

See *[Design spec](index.html#design-spec)*.

Your Presentation (4 points) shall

* describe the major design decisions,
* describe the design of your Game Server,
* describe the design of your Guide Agent,
* describe the design of your Field Agent, and
* describe the roles of each member of your group.

The design document (written in Markdown) shall detail those topics for each of the student-written components:

* Game Server (4 points)
* Guide Agent (4 points)
* Field Agent (3 points)

For each component, the design should describe:

* User interface (including command-line parameters and stdin/stdout/graphical interface);
* Inputs and outputs (files);
* Functional decomposition into modules (parser? sockets? other?);
* Dataflow through modules;
* Major data structures;
* Pseudo code (plain English-like language) for logic/algorithmic flow;
* Testing plan, including unit tests, integration tests, system tests.


## Implementation plan (15 points) {#implementation}

See *[Implementation spec](index.html#implementation-spec)*.

At the time you submit the plan, the plan should provide

* a summary of your plans for implementing each component,
* the prototype and brief description of each function,
* description of the C data structure(s) you plan to use.

We're looking for a clear, modular structure with well-chosen data structures, function names, and function interfaces.

The implementation spec is scored on a 30-point basis:

|      | Game Server (8) | Guide Agent (8) | Field Agent (8) | common (6)
|----- |----          |----        |----         |----
data structures       | 2| 2| 2| 2 
function prototypes   | 2| 2| 2| 1 
function descriptions | 2| 2| 2| 2
modularity (cohesion/coupling) | 2| 2| 2| 1


## Code style and quality (15 points) {#style}

See *[CS50 coding standards]({{site.resources}}/CodingStyle.html)*.

* clear and consistent style
* clear code design, functional decomposition, naming
* clear code logic and flow
* good choice of, and use of data structures* in-code documentation (comments)
* consistent with documentation (IMPLEMENTATION.md)* clear Makefile/scripts for build, test, and run* defensive programming (error checking, malloc, etc.)* no memory leaks caused by student code
* appropriate use of git
	* (all students use git, good commit msgs, etc.)
	* view `git log --decorate --graph --pretty=medium`

## Client presentation (15 points) {#presentation}

See *[Client presentation](index.html#presentation)*.

* 2 - organized and efficient; provide printed copies for Clients
* 2 - all members have meaningful speaking role
* 2 - identify known limitations of implementation
* 9 demo
	* Pebble
	* GameServer
	* Guide Agent

## Functionality (40 points) {#functionality}

Your `IMPLEMENTATION.md` and `TESTING.md` files are ***vitally important*** to help us verify functionality.
As [noted in the assignment](http://www.cs.dartmouth.edu/~cs50/Labs/Project/#submit-all), your `IMPLEMENTATION.md` file should be updated to match your actual implementation.

* 10 [Field Agent](http://www.cs.dartmouth.edu/~cs50/Labs/Project/REQUIREMENTS.html#field-agent)
	* 1 properly handle messages that are syntactically or semantically incorrect
	* 1 send periodic update to GS
	* 1 claim a krag
	* 2 receive and display hints
	* 1 UI to choose from a list of player names
	* 2 UI to enter a kragId
	* 1 UI for game status
	* 1 UI for game over
* 14 [Guide Agent](http://www.cs.dartmouth.edu/~cs50/Labs/Project/REQUIREMENTS.html#guide) (albeit with dramatically different UI expected from 3- and 4-person groups)
	* 1 command line arguments; logging
	* 1 properly handle messages that are syntactically or semantically incorrect
	* 1 send periodic update to GS
	* 3 receive, record, and present game status
	* 3 receive, record, and present status of this team's agents 
	* 2 receive, record, and present clues and the secret
	* 2 send hints to a given agent, or to all agents
	* 1 display of final game summary, and exit when game over
* 16 [Game Server](http://www.cs.dartmouth.edu/~cs50/Labs/Project/REQUIREMENTS.html#server)
	* 1 command line arguments; logging
	* 1 read secret and krags from files
	* 1 create and manage socket, and client addresses
	* 2 properly handle messages that are syntactically or semantically incorrect
	* 2 accept new Agents, and respond with game status
	* 2 receive/handle FA request to claim a krag
	* 1 forward hints from the Guide to an FA or all FAs
	* 2 track the location and status of all players on all teams
	* 2 track game statistics, and send to FA and GA on request
	* 1 present a textual summary of game status on the terminal
	* 1 recognize end of game (two ways); send game-over message

## Segfault (-10 points) {#segfault}

* Any segfault in any program at any time, if triggered by student code.
