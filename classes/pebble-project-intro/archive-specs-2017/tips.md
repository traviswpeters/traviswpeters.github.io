---
layout: page
title: CS50 Final Project - tips from 17S students
---

<!-- from [Piazza](https://piazza.com/class/izsl3qrp6l86gp?cid=489)-->

After they completed this project, CS50 students offered the following tips to future students:

* *Regarding Krag, make sure to start right when the project becomes available.
Don't just plan the Design spec by the first deadline, but start coding and really make sure to understand all the logic of the game.
You can't take a day off CS50 in the last three weeks of the class, or you will start losing time for sleeping, eating, and general other life events real quick.*

* *Break your code up into multiple modules and outline the functions of each module before starting to code, not only because it makes your code cleaner, but also because it makes the project overall seem less daunting.
If you can do this early, you can start biting off small pieces - say, one function per day - and the project will be completed before you know it.
Of course, too many modules and it wouldn't be coherent.*

* *Also, writing a simple program that allowed inputting messages from stdin to send to the game server/guide agent really helped our testing process and made our later transition to integration and systems testing much smoother.*

* *Make sure you at least have two people familiar with each component; this becomes super useful when you need to write testing frameworks and debugging.
If you only have one person familiar with the Pebble watch for example, and if that person runs into trouble late on, then someone will have to learn the Pebble watch stuff from scratch in a short amount of time.
In addition, it helps when working on documentation, having a second set of eyes review your design and implementation.*

* *Make sure to communicate A LOT with your groupmates.
Even if you break up the project so each person is doing one part, make sure to consistently check in with them, and maybe even set standards such as posting to the repo every night so everyone's progress is clear.
Don't just assume that because you did your part that everyone else is doing theirs as well.*

* *Make sure you're on the same page as your group members.
Once the Design doc is cranked out, it's non-stop coding, so you need to make sure you're using the same data structures, style, etc.
Otherwise, when you try to put it all together: variables will be misnamed, functions will take the wrong type, etc.*

* *I would probably tell them to make sure they don't get "tunnel vision".
Our group had several parts that we thought were essential to being able to build up our code.
For example, we thought that we needed to have most of our sockets logic in place before we really started putting game server message handling in place.
However, when it came time to actually start working on game server, we realized that we had left a mountain of work to be done near the end of the project.
This left us very short on time for doing other essential parts of the project near the end.
In other words, make sure that someone is working on everything at all times, the last step should be connecting it all together.*
