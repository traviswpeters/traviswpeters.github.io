---
layout: page
title: Final Project
---

This term's final project is a game called *[Mission Incomputable](mission.html).*
That page provides extensive information about:
* the **[Rules](mission.html#rules)** of the game,
* the communication **[protocol](protocol.html)**,
* a **[diagram](imgs/MI-network.png)** of the connections among all the components,
* and information about the **[Pebble](../index.html)** platform.

Keep the **[rubric](rubric.html)** in mind.

The project code will be written in C (and perhaps a little bash),
    to run on the CS50 Unix servers and on the Pebble smartwatch.
See the **[Pebble](../index.html)** page about writing apps in the context of this game.

We've also provided some useful **[tips](tips.html)**.

Teams
------

We have assigned students to teams of three (or in rare cases, four) students (see the Google Doc posted to Canvas).
Teams of four are required to include one of the 'extended' functions as part of their base functionality.

We assigned each team a name, a teaching assistant, and two specific port numbers to be used by its servers.

One person on your team should fork the [`project-starter-kit`](https://gitlab.cs.dartmouth.edu/traviswpeters/project-starter-kit) Gitlab project,
    rename the project with your team's assigned name,
    edit the project description to list team members,
    then invite your teammates to share the project.
All team members should clone the project to a local repository.

***Before class on Wednesday***, your team should [pick a time for its Design Review](#doodle-link-scrubbed).
Confer among yourselves and list your *team name* on the response form.

Timeline
------------

 * May 16: Requirements announced (in class)
 * May 18: Choose a slot for design review
 * May 20-21: Design spec due (in-person)
 * May 24: Implementation spec due (10pm)
 * June 1: Client presentation (in-person)
 * June 1: Code submission due (10pm)

Requirements spec
------------------

Write three programs in C, as follows.

1. ***Field agent***, a Pebble app that communicates with the game server and interacts with the player wearing the Pebble.

2. ***Guide agent***, a Unix program that communicates with the game server and interacts with the player who acts as a guide.

3. ***Game server***, a server that communicates with all players, from all teams, to record the game's progress and provide information to each of the players.

You may also find it helpful to write a bash script to launch a game.

Specific requirements about each program are listed on the [Mission Incomputable](mission.html) page.

Design spec
------------

At a [pre-arranged time](#doodle-link-scrubbed) on May 20 or May 21, your team will meet its clients (Professor Kotz and Travis Peters) to present your design.
You have 10 minutes to present, and then we have 10 minutes for Q&A.
If you are late for your presentation, you have less time to present to us. (Don't be late.)

Your team should describe its design decisions, and identify which extensions it plans to include.
Be prepared to answer questions and receive feedback from the clients.

Your Gitlab project should include a file `docs/DESIGN.md` at the time of the Design review meeting.
This file does *not* need to include the Requirements spec; instead, link to the project pages on this site.
(Consider drawing a diagram and embedding it in your design document; see [Markdown resources]({{site.resources}}/#markdown)).
***Bring a printed copy of your design with you to the meeting.***

Your design should

* identify which of the functional extensions you plan to support
* describe the major design decisions and their rationale
* describe the design of your Game Server*
* describe the design of your Guide Agent*
* describe the design of your Field Agent*

Recall [Lecture 14: Design Spec](http://www.cs.dartmouth.edu/~cs50/Lectures/14-designcrawler/index.html#design-spec); for each of the above components, describe the

* User interface (including command-line parameters and stdin/stdout/graphical interface)
* Inputs and outputs (primarily, files - we know about the sockets)
* Functional decomposition into modules
* Dataflow through modules
* Major data structures.

You can save for the Implementation plan (below):

* Pseudo code (plain English-like language) for logic/algorithmic flow

And you do not need to document (for us) your

* Testing plan

Implementation spec
-------------------

You must submit an Implementation spec, that is, a summary of your plans for implementing the three applications, providing pseudo code for each and a description of any data structure(s) they use.  The implementation spec should cover the base requirements and any extensions you plan to implement.

Your team's Gitlab project should include a file `docs/IMPLEMENTATION.md` at the time of the Implementation-spec deadline.

Testing plan
------------

Your team should plan for testing *prior* to developing code, and write unit tests *while* writing code, but we do not require you to submit a written plan.  We *do* require you to write a summary of your testing, as in prior labs, and include it along with your submitted code.

Your team's Gitlab project should include a file `docs/TESTING.md` indicating how you tested your solution, at the time the final code is submitted. This file may refer to other files, such as test scripts, test inputs, or test outputs.

Final submission
---------------

Commit all your code and documentation, add tag `submit`, and push to Gitlab ***before the deadline***.  We will grade the version of the code tagged `submit`; if it was pushed after the deadline, you will ***lose 10% per hour after the deadline***.  Read that carefully: 10% *per hour*, not per day. No extensions will be permitted.

Your code should be organized in the directory structure provided, with sensible filenames.

 * There should be a Makefile for each program and a top-level Makefile to build the whole project. *At a minimum*, we must be able to `make all` and `make clean` from the top-level directory.  You may find it useful to add other targets to support unit tests, global tests, installation of Pebble apps, startup/teardown of a game, and so forth, possibly running bash scripts where useful. (In the Pebble app directory, the Makefile might simply call `pebble build` and `pebble clean`.)

 * It must compile (with no warnings) on the CS50 Unix servers with the usual CS50 CFLAGS. It must run without segfaults. It must not have memory leaks as determined with valgrind. (Well, there is no valgrind for checking Pebble apps.)

 * There should be a `README.md` file in each subdirectory (explaining the purpose of that subdirectory and summarizing its contents), and a `README.md` file in the top directory (naming all project team members and summarizing the purpose of each subdirectory).

 * There should be a `docs/` subdirectory containing `DESIGN.md`, `IMPLEMENTATION.md`, and `TESTING.md`, and any other documentation you find it useful to include (examples might include documentation for use of the Game Server, Guide Agent, and Field Agent; links to the Game Rules and Protocol; and so forth.)

 * The Gitlab project (and any freshly cloned copy) should be 'clean'.  That is, it should not contain any 'derived files' (those built by `make` and removed by `make clean`) or any 'scratch files' (including editor backup and autosave files).

You may prepare your client presentation materials after the deadline, up to the moment you meet your clients the next day.

Client presentation
--------------------

At a pre-arranged time on June 1, your team will meet its clients (Professor Kotz and Travis Peters) to present your solution.  You have 10 minutes to present, and then we have 10 minutes for Q&A.  If you are late for your presentation, you have less time to present to us. (Don't be late.)

You should present

 * A demonstration of your solution.
 * A summary of your implementation decisions.
 * Any limitations of your current implementation.

All members of the project team should have a speaking role in this oral presentation.  You may use other media (e.g., textual outline, hand-drawn diagrams, or Powerpoint slides); please bring **two printed copies** for  Professor Kotz and Travis Peters during the presentation.

Grading
--------

Your final project will be graded out of 100 points, with points assigned to categories as follows:

 * 15 points: Design spec
 * 10 points: Implementation spec
 * 10 points: Code style and quality
 * 10 points: Client presentation
 * 35 points: Base functionality
 * 0+ points: Extended functionality (see [list](mission.html#base-and-extensions))
 * -10 points: any segfault *(there will be no opportunity to fix and resubmit)*

***See the [grading rubric](rubric.html).***

Furthermore, immediately after the project you will all complete a confidential online survey in which you comment on your contribution to the project, and the contributions from members of your team; Professor Kotz uses the information in that survey to set 5% of your overall course grade (recall the [grading policy]({{site.logistics}}/#grading)).
