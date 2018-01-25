---
layout: page
title: Getting Started with Pebble
---

A note to readers:
> As a Teaching Assistant for CS 50 in Spring 2016,
> I co-designed the culminating class project with Professor David Kotz and built the "backbone" architecture that helped Pebble devices communicate with game servers.
> The following page is part of the notes composed for the CS 50 culminating project at Dartmouth College.
> Specifically, I crafted this guide to help students in CS 50 learn how to develop software for the Pebble, a popular smartwatch platform.
> Upon introducing the project,
    I gave a guest lecture about event-oriented programming, the supporting architecture for the project, and a general how-to for Pebble software development.
>
> **This specific revision of the notes is current as of May 2016 (with a few minor tweaks of the text since then).**
>
> -Travis

To read about the project (Mission Incomputable),
    see **[my cached version of the specs from 2016](specs-2016/)**.

## Introduction

> **IMPORTANT NOTE:** Before you can really get started and follow along with this tutorial,
    you should charge your Pebble devices and perform any firmware updates --- to be safe,
    please keep your Pebble devices plugged in and charging during any firmware updates!

This tutorial attempts to expand upon content from the official [Pebble Developer Documentation](https://developer.pebble.com/)
    in some places and to distill some concepts in other places.
Please refer to this document and Pebble's Developer Documentation regularly,
    but don't hesitate to ask members of the CS50 staff for help if these resources aren't sufficient for your needs.  

## Overview of Useful Pebble Resources

Here is a summary of links that should be useful for Pebble developers this term.
This summary doesn't necessarily include *everything* that is needed but should provide a good foundation of Pebble knowledge.

* Get the [Pebble SDK](https://developer.pebble.com/sdk/) from the Pebble Developer website.
* A great way to get started with programming on the Pebble is to walk through some of the tutorials.
    Specifically, check out the [Create a C Watchface](https://developer.pebble.com/tutorials/watchface-tutorial/part1) and
    [Add More Features](https://developer.pebble.com/tutorials/intermediate/add-date/).
* The tutorials are nice because it walks through the development of a full-fledged app from start to finish.
    Pebble also provides many *guides* that give snippets of useful source code and details about what developers need to know to use some API, for example.
    Note that most of these guides link to the actual technical documentation for the relevant APIs and you should become familiar with these.
    Some guides that may be useful:
    * Details about the [Pebble command line tool](https://developer.pebble.com/guides/tools-and-resources/pebble-tool/) and
        setting up the [Developer Connection](https://developer.pebble.com/guides/tools-and-resources/developer-connection/) which enables developers to install apps on a physical Pebble device.
    * [AppMessage](https://developer.pebble.com/docs/c/Foundation/AppMessage/) documentation and the Pebble Guides on [Communication](https://developer.pebble.com/guides/communication/)
        which address various best-practices and issues regarding communication between a Pebble device and the companion smartphone.
    * [Graphics](https://developer.pebble.com/docs/c/Graphics/),
        other [UI documentation](https://developer.pebble.com/docs/c/User_Interface/) (e.g., clicks, vibration, light),
        and [Example Implementations: UI Components and Patterns + Example Apps](https://developer.pebble.com/guides/design-and-interaction/implementation/).
    * [Timers](https://developer.pebble.com/docs/c/Foundation/Timer/) (performing some task periodically).
    * [Bluetooth Connection Service](https://developer.pebble.com/docs/c/Foundation/Event_Service/ConnectionService/) (monitoring the state of the connection).
    * Sensors/Services: [Accelerometer](https://developer.pebble.com/docs/c/Foundation/Event_Service/AccelerometerService/),
        [Compass](https://developer.pebble.com/docs/c/Foundation/Event_Service/CompassService/),
        [Battery State](https://developer.pebble.com/docs/c/Foundation/Event_Service/BatteryStateService/) and
        [Health Services](https://developer.pebble.com/docs/c/Foundation/Event_Service/HealthService/).
    * An overview of [Debugging](https://developer.pebble.com/guides/debugging/).
    * Various [Best Practices](https://developer.pebble.com/guides/best-practices/) that you should keep in mind while developing your app.


We've also provided some information below to help you get started.

## Setup

When you first turn on your Pebble it will instruct you to download the official Pebble smartphone app by visiting
    [getpebble.com/app](https://www.pebble.com/apps) (which redirects you to an updated page: [https://www.pebble.com/apps](https://www.pebble.com/apps) shown below).
You'll need to download the official Pebble app to setup your Pebble Time---they have smartphone apps for both iOS and Android.

![Pebble App Landing Page](specs-2016/imgs/pebble-home.png)

Also note that the startup screen on your Pebble displays the "name" of your Pebble Time (below the URL to get the app)
    that you will see when you try to scan for it on Bluetooth (a unique 4 character Bluetooth name that corresponds to the
        last 4 hex digits---or 2 bytes---of your Pebble's Bluetooth MAC address); for example, you might see "Pebble Time ABCD".
Write this down or keep track of this somehow for your reference
    (you can view it later in "Settings" > "BLUETOOTH" if you need though).

## Development machine & companion device requirements

To get setup with the Pebble Software Development Framework (SDK), please consult ["Installing the Pebble SDK"](https://developer.pebble.com/sdk/install/).
Pebble's documentation is the primary authority regarding details for installing the SDK.
For your convenience we've provided a few notes below regarding various requirements for development machines and companion devices (e.g., smartphones).

**OS X Requirements**

Pebble *strongly* encourages the installation of their tools on OS X platforms via `homebrew` (super easy!).
The following command will attempt to update your installation of the `homebrew` tool and then install the pebble SDK:

```bash
$ brew update && brew install pebble/pebble-sdk/pebble-sdk
```

No specific OS version requirement is explicitly stated, though the following software is required:

- Xcode command line tools
- Python 2.7

For more information, please see Pebble's official documentation for installing the SDK on OS X.

**Linux Requirements:**

The Pebble SDK is officially supported on Ubuntu GNU/Linux 12.04 LTS, Ubuntu 13.04, Ubuntu 13.10 and Ubuntu 14.04 LTS.

See ["Installing the Pebble SDK on Linux"](https://developer.pebble.com/sdk/install/linux/) for more information..

**Windows Requirements:**

Installing the Pebble SDK on Windows is not officially supported.
If you don't own a machine that can run OS X or Linux, recall that we have a Mac lab in the basement of Sudikoff.

### Smartphone Companion App

Due to the limited user interface (UI) on smartwatches it is common to pair a smartwatch with a "companion device"
    such as a smartphone---which has richer UI capabilities---to configure your smartwatch (e.g., change the watchface, install new applications).
Depending on your device you can find a suitable Pebble application in the *Google Play Store* or *Apple App Store*.

You can visit [https://www.pebble.com/apps](https://www.pebble.com/apps) to download the Pebble app,
    or search for it on your phone in the Apple App Store or Google Play apps.

### Pairing Your Smartphone and Pebble

Make sure that your Pebble is powered on (if off, hold the "back" button for ~1-2 seconds to turn on), and that your Pebble device has sufficient charge.
A quick overview of the Pebble buttons:

* **left button** is the "back" button
* **top-right button** is the "up" button
* **middle-right button** is the "select" button
* **bottom-right button** is the "down" button

To pair your Pebble to a smartphone, you must first ensure that the Pebble's bluetooth is enabled.
To do this, you should:

1. Click the "back" button until you reach the home screen (back will no longer do anything once you've reached the home screen).
2. Click the "select" button, which should pull up a list of applications and functions supported by your Pebble
3. The first thing on this list should be "Settings". Select it using the "select" button.
4. Press "select" once more to open bluetooth settings
5. If you see "Connection: Airplane Mode", click the "select" button once to enable bluetooth.
Once enabled, you should see "Connection: Pebble Time XXXX", where XXXX is the 4-digit hex code unique to your Pebble.

On your smartphone:

1. Open the Pebble app, and click the dropdown menu at the top right of the screen and select "Manage Pebble"
2. At the bottom of the screen, click "FIND A NEW PEBBLE"
3. After a few seconds, you should see an entry similar to "PEBBLE TIME XXXX", where XXXX is the 4-digit hex code unique to your pebble. Click on it.
4. Both your phone and Pebble will prompt you to accept the pairing.

## Building programs and "installing" them on your Pebble

A question that will likely come up for a Pebble developer is: *How do I "make" (i.e., build) my programs and get them to run on the Pebble smartwatch?*
Great question!
When you install the Pebble SDK, one of the components you get is the *Pebble Command Line Tool*.
The Pebble Command Line Tool allows you to perform actions similar to what you do in your regular development workflow now.

For example, suppose you want to run `make` to build your program.
It turns out that Pebble has removed a lot of the burden of writing Makefiles and defining various targets within them;
    Pebble keeps things nice and simple by giving you commands like `pebble build` and `pebble clean`.
The consequence of the Pebble Command Line Tool's added convenience is that you are a more limited in what you can achieve
    (i.e., no easy way for you to define fancy `PHONY` targets that, for example, build your program with test flags and automatically runs on nice test data).
For those that are interested,
    Pebble actually uses an automatic build system called [Waf](https://en.wikipedia.org/wiki/Waf) under the hood that can be extended,
    however, that is outside of the scope of this tutorial.

When it comes to installing/running your program,
    rather than doing something like `./PROG` to run your program on a traditional UNIX-y system, you run `pebble install ...` where `...`
    usually specifies some information about *how* (and in some cases, *where*) you want to install your Pebble program.
The *how* and *where* are important!
Think about it: you are writing code on your laptop/desktop computer...
    and you will build an executable file on the same computer...
    but then you want to put that executable onto your pebble and start it running.

### How?

When we ask "how" we are really asking:

> How do I get something (e.g., my executable code) from my computer to the Pebble?

There are various ways you can connect to your Pebble but we will primarily focus on two: (1) over Bluetooth, and (2) over a Wi-Fi network.
In both cases, see the official Pebble documentation on ["Connecting to a Pebble"](https://developer.pebble.com/guides/tools-and-resources/pebble-tool/#connecting-to-a-pebble);
    we clarify some points below.

***Bluetooth***

It is possible to install code from your computer (laptop/desktop) directly to your Pebble over Bluetooth with the Pebble command line tool:

```bash
$ pebble install --serial SERIAL
```

In order to do this you must first pair your Pebble with your computer.
You'll have to turn Bluetooth on and let your computer scan for nearby devices.
If you don't see your Pebble, you might need to navigate to the Bluetooth settings on your Pebble---when
    the Bluetooth settings menu is open your Pebble will certainly be in "discoverable" mode.
(**NOTE**: Hit the center button on the right side of the watchface, then select "Settings",
    and finally select "BLUETOOTH" to navigate to the Bluetooth settings menu).
Follow the instructions to pair your computer/Pebble.

In the Bluetooth settings menu the first "item" should show a sort of identifier for your Pebble device, for example "Pebble D2DB".
The last 4 characters (e.g., "D2DB" can be used to uniquely identify your Pebble
(**NOTE**: These characters are hexadecimal characters and actually correspond to the last 2 bytes in your Pebble's Bluetooth MAC address -
    verify this by going to "Settings" > "SYSTEM" > "Information" where you can see your complete "BT Address").

With all of this said, once your devices are paired and you know your Pebble device identifier, you are ready to connect to your Pebble over Bluetooth.
When you run something like `pebble install --serial ...` you need to provide the path to the
    [*serial device*](https://developer.bluetooth.org/TechnologyOverview/Pages/SPP.aspx)
    which allows you to communicate with your Pebble
    (this is created when you pair your Pebble with your computer).
You can find your Pebble serial device by going to the `/dev/` directory and looking for a device with the prefix `cu.Pebble` (e.g., `/dev/cu.Pebble`).
Once this is typed out you can use tab to auto-complete your device name.
The full path to my Pebble is `/dev/cu.PebbleD2DB-SerialPortSe`.
Notice that the next part consists of the 4 character Pebble identifier we discussed earlier.
Putting all of this together, I can install and run programs on my Pebble over Bluetooth as follows:

```bash
$ pebble install --serial /dev/cu.PebbleD2DB-SerialPortSe
```

If you are having trouble, verify that this connection is working by `ping`ing your Pebble
    (when you run the command, if the connection is successful there will be a small delay and then you should see the text "pong" written to the terminal;
    check your watchface as well as it should print the text "ping" to the screen, indicating it received the "ping" and sent your computer back a "pong"):

```bash
$ pebble ping --serial /dev/cu.PebbleD2DB-SerialPortSe
Pong!
```

***Wi-Fi***

It is also possible to install code from your computer (laptop/desktop) to your Pebble over Wi-Fi via your smartphone with the Pebble command line tool:

```bash
$ pebble install --phone IP
```

There are, however, a few caveats:

1. You need to enable the ["Developer Connection"](https://developer.pebble.com/guides/tools-and-resources/pebble-tool/#enabling-the-developer-connection) on your smartphone.
2. Your computer and your smartphone must be on the same network.
3. You must pair your Pebble with your smartphone and have Bluetooth enabled on your smartphone.

If you've done all of this correctly you should be able to find the IP address of your phone and run a command such as:

```bash
$ pebble install --phone 10.0.1.10
```

where `10.0.1.10` is the IP address of my phone currently.

Note that, just like with Bluetooth, you can test if your connection over Wi-Fi is working with the `pebble ping` command:

```bash
$ pebble ping --phone 10.0.1.10
Pong!
```

### Where?

When we ask "where" we are really asking:

> Where do I want to put something (e.g., my executable code)?

So far we've only talked about installing code on your actual Pebble device (see above) so this question seems moot.
It turns out, however, that you can, alternatively, choose to install your code on an *emulator* that emulates a Pebble device
    which means you don't need an actual physical Pebble device to develop code for a Pebble!
This is pretty cool!

Generally speaking, you have the power to specify the type of emulator you'd like to use for running your application
    (currently Pebble offers three choices: `{aplite,basalt,chalk}`).

```bash
$ pebble install --emulator EMULATOR
```

In this class you'll want to use `basalt` as we are working with Pebble Time smartwatches specifically which run on the `basalt` platform.

```bash
$ pebble install --emulator basalt
```

The emulator really is great.
For example, if you don't have a phone but you do have an Internet connection,
    the emulator will setup a simulator for a phone which will allow you to write code that runs on the phone without actually having a phone!
    (This will be useful since you are your team members will be sharing a limited number of Pebbles and may need to use the emulator at times for your development/testing).

For your convenience we've created a
    [`.pebblerc`](./specs-2016/pebblerc)
    file which you are encouraged to use if it helps your application development.
In this file we provide some convenience aliases as well as sample
    [configurations for the Pebble Tool](https://developer.pebble.com/guides/tools-and-resources/pebble-tool/#configure-the-pebble-tool).

**`.pebblerc`:**

```bash
# cs50 project env variables (defaults)
export PEBBLE_BT_DEV=/dev/cu.PebbleD2DB-SerialPortSe                            # CHANGEME: you need to update the identifier for your pebble in cu.Pebble[IDENTIFIER]
export PEBBLE_PHONE=192.168.1.11                                                # CHANGEME: IP address of the phone
export PEBBLE_EMULATOR=basalt                                                   # CHANGEME: default choice of emulator platform
export PEBBLE_QEMU=localhost:12344                                              # CHANGEME: default instance of QEMU

# cs50 project management aliases
alias pebbuild="pebble build"                                                   # compile & build project into '.pbw' file
alias pebclean="pebble clean"                                                   # delete all files in ./build

# pebble physical device (WiFi) aliases
alias pebphoneping="pebble ping --phone ${PEBBLE_PHONE}"                        # ping pebble via phone by IP
alias pebphoneinstall="pebble install --phone ${PEBBLE_PHONE}"                  # install 'pbw' onto connected phone over WiFi (by IP)
alias pebphoneinstalllogs="pebphoneinstall --logs"                              # install 'pbw' onto connected phone over WiFi (by IP; immediately attach & get log info)

# pebble physical device (Bluetooth) aliases
alias pebbtinstall="pebble install --serial ${PEBBLE_BT_DEV}"                   # install 'pbw' on pebble watch over Bluetooth
alias pebbtinstalllogs="pebbtinstall --logs"                                    # install 'pbw' on pebble watch over Bluetooth (immediately attach & get log info)

# pebble emulator aliases
alias pebemulatorstart="pebble install --emulator ${PEBBLE_EMULATOR}"           # simply start emulator if no 'pbw' is provided or not in app directory
alias pebemulatorkill="pebble kill"                                             # convenience alias
alias pebkill="pebemulatorkill"                                                 # convenience alias
alias pebemulatorinstall="pebble install --emulator ${PEBBLE_EMULATOR}"         # install 'pbw' onto default emulator
alias pebemulatorlogs="pebble logs --emulator ${PEBBLE_EMULATOR}"
alias pebemulatorgdb="pebble gdb --emulator ${PEBBLE_EMULATOR}"                 # start gdb (only works on emulator)
alias pebgdb="pebemulatorgdb"                                                   # another (convenience) alias for starting gdb on the emulator
                                                                                # -> see: https://developer.pebble.com/guides/tools-and-resources/pebble-tool/#emulator-interaction
                                                                                #    and: https://developer.pebble.com/guides/debugging/debugging-with-gdb/
```

To use the `.pebblerc` file, you can `source` it in your `.bashrc` file.
You can run these commands on the command line to update your `.bashrc` file and load the changes in your current shell:

```bash
$ git pull upstream master #<<< run this to pull the ".pebblerc" file from the upstream repo
$ echo "source ~/cs50/project/project-starter-kit/examples/.pebblerc" >> ~/.bashrc
$ source ~/.bashrc
```

You may need to adjust the path to reflect where your project repo is located on your machine.

## Possible Pebble "Gotchas" & Fixes

### Issues with Emulator in Pebble SDK Version 3.12

I've noticed that there seems to be a bit of an issue with **version 3.12** of the Pebble SDK.
I found that reverting to a previous version greatly improves the usability of the emulator (sometimes it takes a long time to boot and sometimes it doesn't boot at all!).

Check your current version:

```bash
$ pebble sdk list
```

If you are running **version 3.12**, "downgrade" to a previous (stable) version:

```bash
$ pebble sdk install 3.11
```

Accept the *Pebble Terms of Use* and the *Pebble Developer License*. You should be good to go now!

### Using `strtok()` on Pebble

It seems that `strtok()` is not available "out of the box" on Pebble.
Thankfully, there is an open source version of this routine which we can adopt for our project:
    [`strtok()`](http://opensource.apple.com//source/Libc/Libc-167/string.subproj/strtok.c).

I did a little renaming to make it clear that this is our version of `strtok()` for pebble
    (`pebble_strtok()`) and added a nice header file so you don't have to lug the prototype around with you.
You can pull the [`pebble_strtok[.c/.h]`](https://gitlab.cs.dartmouth.edu/traviswpeters/project-starter-kit/commit/b9d9f2a3aa18f18fc1923e1afd11180978d1bcd2)
    files that I added in the starter kit:

```bash
$ git pull upstream master
```

At the top of your file where you want to use `pebble_strtok()`, `#include` the following:

```c
#include "pebble_strtok.h"
```

And now you can use `pebble_strtok()` to parse a string on some delimiter. Here is an example:

```c
/*
 * Example code modified from this tutorialspoint example:
 * http://www.tutorialspoint.com/c_standard_library/c_function_strtok.html
 */

int i = 0;
char str[100] = "THIS|IS|MY|TEST|STR";
const char delim[2] = "|";
char *token;

/* get the first token */
token = pebble_strtok(str, delim);

/* walk through other tokens */
while( token != NULL ) {
    LOG( "%d: %s", i, token );
    token = pebble_strtok(NULL, delim);
    i++;
}
```

### Sharing Code Between Your Pebble App and Other Components (e.g., Guide Agent)

The [`project-starter-kit`](https://gitlab.cs.dartmouth.edu/traviswpeters/project-starter-kit/tree/master) provides an overall directory structure already.
We have encouraged you to write modular code and try to reuse that code (e.g., parsing) between the various components
    in this project where you are able---this is not as straightforward as in the past, however, since Pebble relies on its app's files living in a specific directory structure.
The best way I've found to do this is to create a `common` directory in the root of your project and add shared files there.
I've updated the Pebble's build script ([`wscript`](https://gitlab.cs.dartmouth.edu/traviswpeters/project-starter-kit/commit/09f040f1e464478dbe70301341a682b76c3473bc))
    to specifically look for sources in a directory named `common` so please follow this naming convention.
As always, you can get my changes by running:

```bash
$ git pull upstream master
```

```
$ tree .
.
|-- GETTING-STARTED.md
|-- Makefile
|-- README.md
|-- common             <<<< TODO: Create a new directory for shared code named "common"
|   |-- shared.c
|   |-- shared.h
|-- docs
|   |-- DESIGN.md
|   |-- IMPLEMENTATION.md
|   |-- MI-network.png
|   `-- TESTING.md
|-- examples
|   `-- appinfo.json
|-- field_agent
|   |-- Makefile
|   |-- appinfo.json
|   |-- resources
|   |-- src
|   |   |-- Makefile
|   |   |-- field_agent.c
|   |   |-- js
|   |   |   |-- app.js
|   |   |   `-- appinfo.js
|   |   `-- mission.h
|   `-- wscript
|-- game_server
|   `-- Makefile
|-- guide_agent
|   `-- Makefile
`-- proxy
    |-- package.json
    `-- proxy
```

To demonstrate how this works, create the following files in the `common` subdirectory:


**`shared.c`:**

```c
// Conditional inclusion for platform specific builds
#ifdef NOPEBBLE // we are *not* building for pebble
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#else // we are building for pebble
#include <pebble.h>
#endif

#include "shared.h"

const char *version_str = "1.0";

void print_shared() {
  printf("===> shared function! (v%s) <===", version_str);
}
```

**`shared.h`:**

```
#ifndef __SHARED_TEST_H
#define __SHARED_TEST_H

extern const char *version_str;

void print_shared();

#endif // __SHARED_TEST_H
```

Next, add this `#include` to one of your source files in the `field_agent/src/` directory (e.g., `field_agent.c`):

```c
#include "../../common/shared.h"
```

And now you are free to utilize variables and functions from your `shared[.c/.h]` files.
For our example, add this call somewhere in your code:

```
print_shared();
```

Now suppose you want to use `shared.c` and `shared.h` in your Game Server code, for example.
Lets add the following files to your `game_server` directory:

**`main.c`:**

```c
#include <stdio.h>

#include "../common/shared.h"

int main(void) {
    printf("I can use common/ too!\n");
    print_shared();
    return 0;
}
```

**`Makefile`:**

```make
PROG = game_server
OBJS = main.o ../common/shared.o
LIBS =

# add -DNOPEBBLE if building as non-pebble application (e.g., game server).
CFLAGS = -Wall -pedantic -std=c11 -ggdb -DNOPEBBLE
CC = gcc
MAKE = make

$(PROG): $(OBJS)
	$(CC) $(CFLAGS) $^ $(LIBS) -o $@

../common/shared.o: ../common/shared.h

clean:
	rm -rf $(PROG) *~ *.o *.dSYM
```

Finally, `make` and run the code to see that you have access to code defined in the shared files:

```bash
$ make
gcc -Wall -pedantic -std=c11 -ggdb -DNOPEBBLE   -c -o main.o main.c
gcc -Wall -pedantic -std=c11 -ggdb -DNOPEBBLE   -c -o ../common/shared.o ../common/shared.c
gcc -Wall -pedantic -std=c11 -ggdb -DNOPEBBLE main.o ../common/shared.o  -o game_server

$ ./game_server
I can use common/ too!
*** shared function! (v1.0) ***
```

Notice that our `Makefile` includes a `-DNOPEBBLE` flag to indicate that this we want to define that `NOPEBBLE` flag
    which we use to distinguish between pebble/non-pebble platforms.
In this case, we do ***not*** want to build for the pebble device, but rather, for a regular Linux machine;
    the difference being that for the Pebble, we only need to `#include <pebble.h>`
    whereas on other Linux machines we way to `#include` things like `stdio.h`, `stdlib.h`, `string.h`, and so forth.

The **TL;DR** version is that you need to use conditional inclusion in your code that
    you intend to share in some cases in order to ensure that you are using the correct header files and
    underlying functions that your platform offers.







## Field Agent/Game Server/Guide Agent Communication

In this section we hope to clarify a few matters regarding how the various components in this project communicate.

#### Proxies Explained

It is essential that you and your team have a good understanding of how all of the Key Assembly components work together.
The diagram below shows the following:

* You are only responsible for building the Field Agent, Guide Agent, and Game Server components -- the Unix and
    smartphone proxy components are provided.
* There is a 1-to-1 mapping between Field Agents and phone proxies.
    Each Field Agent (Pebble) is paired with a companion smartphone that enables the Field Agent
    to deliver messages to the Game Server over the Internet.
    The phone proxy's primary role is to run indefinitely, sending messages from the Field Agent to the Game Server
    (via the Unix Proxy) and vice versa.
* Field Agents, by virtue of their relationship with the phone proxy, can't communicate directly with other Field Agents.
    Field Agents can only communicate with the Game Server through the phone proxy and the Unix proxy.
    The phone proxy must know the address (IP and port) of the Unix proxy and the Game Server, in advance,
    which is why that address is configured in `appinfo.json`.
* Guide Agents are able to communicate directly over UDP with the Game Server; they must be given the address (IP and port) of the Game Server.
* There is a 1-to-1 mapping between a Unix proxy and Game Server.
    In other words, all Field Agents in a given game communicate (via their phone proxy) with the Game Server via one, and only one, Unix proxy.
    All Field Agent communications with the Unix Proxy are over a reliable WebSocket (TCP) connection
    (because phone proxies are able to create WebSockets but are unable to create UDP sockets).
    The Unix proxy, able to create UDP sockets, creates a new UDP socket for each player
    (to receive datagrams back from the Game Server) and sends all of its "traffic" to the pre-defined UDP address on the Game Server.
    Thus, although there is only one Unix proxy, each Field Agent appears to the Game Server as being at a distinct address.
    * _Digging Deeper (for those interested)_: Every phone proxy that connects to the Unix proxy has a single,
        reliable connection for communication.
        As part of handling the new connection, the Unix proxy creates a new UDP socket for
        sending/receiving datagrams to/from that websocket connection.
        This means that every Field Agent connected to the Unix proxy gets a unique UDP socket which
        makes the player appear as if it is communicating with the Game Server via UDP all by itself/directly!
        This is why, as the builder of the Game Server, you need only worry about handling datagrams received over
        a single UDP socket - just pay attention to the address (IP/port) from whence those datagrams arrive.
* Your Game Server is responsible for managing information about the various clients that are actively involved in game play.
    Think of the Game Server representing each agent with a sort of tuple consisting of `<remoteAddress, remotePort, agentId>`
    where `agentId` can be a unique identifier for either a Field Agent (`pebbleId`) or Guide Agent (`guideId`).
    (In reality my "mental tuple" is a `struct` with the aforementioned information plus more).
    Our ability to uniquely identify any given player is entirely dependent on the unique ID.
    To communicate back to specific players we can identify them by their unique ID and
    then use their remote address/port information to send datagrams.

<!--center tag not supported in html5?-->
![Key Assembly Network Diagram](./specs-2016/imgs/MI-network.png)

***=>*** *In summary: your Game Server needs to
    (1) open a single UDP socket which it will read from, and
    (2) keep track of the remote client's address (IP/port) for all known agents (both Guide Agents and Field Agents).*

#### Guide Agent: Communicating over Bluetooth

The Pebble has no Wi-Fi interface and cannot connect directly to the Internet.
To reach the Internet, it must send messages through some companion device (e.g., your smartphone) over Bluetooth,
    and then messages can be sent to the Game Server over your companion device's Wi-Fi or Cellular connection to the Internet.
To use Bluetooth, you'll need to use Pebble's `AppMessage` API.

> AppMessage is a bi-directional messaging subsystem that enables communication between phone apps and Pebble watchapps.
> This is accomplished by allowing phone and watchapps to exchange arbitrary sets of key/value pairs.
> The key/value pairs are stored in the form of a Dictionary, the layout of which is left for the application developer to define.

> AppMessage implements a push-oriented messaging protocol,
>   enabling your app to call functions and methods to push messages from Pebble to phone and vice versa.
> The protocol is symmetric: both Pebble and the phone can send messages.
> All messages are acknowledged.
> In this context, there is no client-server model, as such.

> During the sending phase, one side initiates the communication by transferring a dictionary over the air.
> The other side then receives this message and is given an opportunity to perform actions on that data.
> As soon as possible, the other side is expected to reply to the message with a simple acknowledgment that the message was received successfully.

> PebbleKit JavaScript provides you with a set of standard JavaScript APIs that let your app receive messages from the watch,
>   make HTTP requests, and send new messages to the watch.
> AppMessage APIs are used to send and receive data.
> A Pebble watchapp can use the resources of the connected phone to fetch information from web services,
>   send information to web APIs, or store login credentials.
> On the JavaScript side, you communicate with Pebble via a Pebble object exposed in the namespace.

> Messages always need to get either ACKnowledged or "NACK'ed," that is, not acknowledged.
> If not, messages will result in a time-out failure.
> The AppMessage subsystem takes care of this implicitly.
> In the phone libraries, this step is a bit more explicit.

> The Pebble watch interfaces make a distinction between the Inbox and the Outbox calls.
> The Inbox receives messages from the phone on the watch; the Outbox sends messages from the watch to the phone.
> These two buffers can be managed separately.

> -- from Pebble's official documentation on the [AppMessage subsystem](https://developer.pebble.com/docs/c/Foundation/AppMessage/).

To communicate over Bluetooth you'll have to define 4 functions that do the work of preparing messages
    to be sent and parsing messages upon receiving them,
    and then register those functions as callbacks with Pebble's `AppMessage` subsystem (Bluetooth).


```c
// Register Bluetooth communication callbacks
app_message_register_inbox_received(inbox_received_handler);
app_message_register_inbox_dropped(inbox_dropped_callback);
app_message_register_outbox_failed(outbox_failed_callback);
app_message_register_outbox_sent(outbox_sent_callback);

// Open `AppMessage` - to always get the largest buffer available, follow this best practice:
app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
```

Notice that Pebble uses the notion of "inboxes" and "outboxes" to denote where messages are kept upon receiving them,
    and where messages are put when you want to inform the system you are ready to send a message, respectively.
When we open the `AppMessage` subsystem, we request the maximum-sized boxes,
    because the Mission Incomputable protocol requires fairly lengthly messages.

After setting up your inbox and outbox for Bluetooth communications,
    you can access messages when they arrive at your Pebble.
For example, one of the (many) communications your Pebble app will receive corresponds to `AppKeyJSReady`
    (indicating that the JavaScript (JS) environment is ready and running on your smartphone,
    and is ready to communicate with your Pebble).

```c
// This is my callback that I registered above (i.e., called when a new message arrives over Bluetooth)
static void inbox_received_handler(DictionaryIterator *iterator, void *context) {
    // Check: Is this a PebbleKit JS ready message?! If so, then it is safe to send messages!
    Tuple *ready_tuple = dict_find(iterator, AppKeyJSReady);
    if(ready_tuple) {
        // Log the value sent as part of the received message.
        char *ready_str = ready_tuple->value->cstring;
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Got AppKeyJSReady: %s", ready_str);
    }

    // ...other *checks*...
}
```

All data between your Pebble and smartphone is stored in a *dictionary*
([`DictionaryIterator`](https://developer.pebble.com/docs/c/Foundation/Dictionary/#DictionaryIterator)),
making it possible for your Pebble code to receive data from the smartphone by looking up a predefined key (`AppKeyJSReady`)
in the dictionary and processing the data (value) returned.
The `dict_find(...)` routine will return `NULL` if the key is not found in `iterator`.

The companion smartphone will send many other kinds of messages;
in `key_assembly.h` we provide only the keys you should need.

```c
// see: key_assembly.h -- AppMessage keys (***DO NOT MODIFY***)
enum {
  AppKeyJSReady = 0,      // The JS environment on the companion smartphone is up and running!
  AppKeySendMsg,          // Send a message over Bluetooth to the companion smartphone and then on to the Game Server
  AppKeyRecvMsg,          // A message from the Game Server is available (arrived over Bluetooth)
  AppKeyLocation,         // Request your GPS location from the companion smartphone
  AppKeyPebbleId,         // Request your unique pebble ID from the companion smartphone
  AppKeySendError         // Error: companion app can't connect to the Proxy (and ultimately the Game Server).
};
```

Some of these keys are for receiving information from the smartphone,
    some are for sending information to the smartphone (and then to the Game Server),
    and some are for both sending and receiving, as follows.

* `{AppKeyJSReady : PEBBLE-ID}` - sent from the smartphone to the pebble; for convenience,
    the "value" contains the Pebble ID that players must send to the Game Server as part of their well-formatted messages.
* `{AppKeySendMsg : FORMATTED-GAME-MSG}` - sent from the pebble to the smartphone to ask it to send the "value",
    a formatted string, to the Game Server.
* `{AppKeyRecvMsg : FORMATTED-GAME-MSG}` - sent from the smartphone to the pebble to inform the pebble
    that a message from the Game Server has arrived.
    The "value" is a well-formatted string.
* `{AppKeyLocation : IGNORED/LOCATION-STR}` - when sent from the pebble to the smartphone,
    the smartphone interprets this as a request to get the current location of the user; the "value" is ignored so it can be anything.
    When sent from the smartphone to the pebble, the pebble interprets this as a response to a previous location request it made and
    stores the "value" (a string with latitude and longitude separated by a vertical bar (`|`)) as its last known location.
* `{AppKeyPebbleId : IGNORED/PEBBLE-ID}` - when sent from the pebble to the smartphone, the smartphone interprets this
    as an explicit request to get the Pebble ID; the "value" is ignored so it can be anything.
    When sent from the smartphone to the pebble, the pebble interprets this as a response to a
    previous request it made to get the Pebble ID and stores the "value" (a string with the Pebble ID).
* `{AppKeySendError : DETAILED-ERROR-MSG}` - sent from the smartphone to the pebble to inform the pebble that it,
    as the phone proxy, is unable to connect via a WebSocket to the Unix proxy.

Now that you know how to check to see if some *received* message corresponds to a particular type of message,
    and you know all of the defined keys that exist for communication between your Pebble and a companion device,
    the last relevant bit of information is how to *send* data to the companion over Bluetooth.
One thing that you will want to do periodically in your Pebble application is request your current location.
The Pebble doesn't have GPS but your smartphone does and the companion app knows how to
    query your smartphone services for your current GPS data.

```c
// Request location
sendInt(AppKeyLocation, 1);
```

where

```c
/*
 * Send a message (int) to the smartphone over Bluetooth.
 * (if the JS environment is ready).
 */
static void sendInt(int key, int value) {
    // Declare the dictionary's iterator
    DictionaryIterator *iter;

    // Prepare the outbox buffer for this message
    AppMessageResult result = app_message_outbox_begin(&iter);

    if(result == APP_MSG_OK) {
      // Construct & send the message.
      dict_write_int(iter, key, &value, sizeof(int), true);
      result = app_message_outbox_send();
      if(result != APP_MSG_OK) {
        // handle error!
      }
    } else {
        // handle error!
    }
}
```

It is worth noting in this case that the smartphone doesn't care what *value*
    you send it as part of the key/value pair data---the smartphone will try to get location data and
    send it back to you anytime you send it a message keyed with `AppKeyLocation` regardless of the value.

I've also only showed you how to send messages with `int` values;
    as you might imagine you might find it useful to create other versions of such a routine
    for handling sending messages where the value can be a different type (e.g., strings).

**IMPORTANT NOTE:** *We haven't included the source code in the `sendInt()` routine
    to address some issues that are definitely worth considering -- such as
    checking that the JS environment on the smartphone is up and running before you try to send it messages,
    and handling the error cases that I allude to in the example code above.
You should spend some time thinking about how your Pebble application can best handle these issues.*

#### Suggested Resources - Bluetooth Communications

It is our goal to provide some ideas on how to get going with the project here,
    but this is in no way a comprehensive guide for all that you need to know in order to implement the project.
For more information on Pebble APIs and services provided on the Pebble platform,
    as well as more examples around how Bluetooth communications work on the Pebble,
    see Pebble's official documentation for
    [`AppMessage`](https://developer.pebble.com/docs/c/Foundation/AppMessage/)
    as well as the Pebble guides on
    [Advanced Communication](https://developer.pebble.com/guides/communication/advanced-communication/) and
    [Sending and Receiving Data](https://developer.pebble.com/guides/communication/sending-and-receiving-data/).
You may also find the [`TickTimerService`](https://developer.pebble.com/docs/c/Foundation/Event_Service/TickTimerService/)
    and
    [`ConnectionService`](https://developer.pebble.com/docs/c/Foundation/Event_Service/ConnectionService/)
    documentation useful.
