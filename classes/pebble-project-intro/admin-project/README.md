A  `README` for internal use by cs50 staff. This directory is primarily meant to maintain (1) internal information for the Mission Incomputable project, (2) the `project-starter-kit` that is provided to students, (3) our reference materials (e.g., reference solution), and (4) scripts and other materials used for evaluating/testing this project. 

## Directory Structure Overview

***Please update this tree if content is added/removed!***

```
$ tree .
.
|-- README.md                   <<< This document
|-- code-drop-helper            <<< A simple pebble app to aid in build Code Drop files.
|-- docs                        <<< TODO: reference docs for our solution / internal reference
|   |-- DESIGN.md
|   |-- IMPLEMENTATION.md
|   `-- TESTING.md
|-- project-starter-kit         <<< A basic starter kit for the Mission Incomputable project
|   |-- GETTING-STARTED.md
|   |-- Makefile
|   |-- README.md
|   |-- common
|   |-- docs
|   |   |-- DESIGN.md
|   |   |-- IMPLEMENTATION.md
|   |   |-- MI-network.png
|   |   `-- TESTING.md
|   |-- examples                <<< Example files we provide as part of the starter kit
|   |   `-- appinfo.json
|   |-- field_agent             <<< The Field Agent (Pebble) application
|   |   |-- Makefile
|   |   |-- appinfo.json
|   |   |-- resources
|   |   |-- src
|   |   |   |-- Makefile
|   |   |   |-- field_agent.c
|   |   |   |-- js
|   |   |   |   |-- app.js
|   |   |   |   `-- appinfo.js
|   |   |   |-- mission.h
|   |   |   |-- pebble_strtok.c
|   |   |   `-- pebble_strtok.h
|   |   `-- wscript
|   |-- game_server             <<< The Game Server application
|   |   `-- Makefile
|   |-- guide_agent             <<< The Guide Agent application
|   |   `-- Makefile
|   `-- proxy                   <<< The UNIX proxy that allows the Field Agent to communicate w/ the Game Server
|       |-- package.json
|       `-- proxy
|-- rubric_project.md           <<< Project rubric
`-- src                         <<< TODO: Our solution
    `-- placeholder
`-- test                        <<< TODO: Test materials for the Mission Incomputable project
    `-- placeholder
```

## Component Interaction Overview

![Field Ageint, Game Server, and Guide Agent Communication](http://www.cs.dartmouth.edu/~cs50/Labs/Project/imgs/MI-network.png)

## Pebble & Smartphone Companion Device (E.g., Smartphone Proxy)

#### Useful Pebble Develper Documentation & Other Resources

* [AppMessage](https://developer.pebble.com/docs/c/Foundation/AppMessage/) documentation and the Pebble Guides on [Communication](https://developer.pebble.com/guides/communication/) which address various best-practices and issues regarding communication between a Pebble device and the companion smartphone.
* [Graphics](https://developer.pebble.com/docs/c/Graphics/), other [UI documentation](https://developer.pebble.com/docs/c/User_Interface/) (e.g., clicks, vibration, light), and [Example Implementations: UI Components and Patterns + Example Apps](https://developer.pebble.com/guides/design-and-interaction/implementation/). 
* [Timers](https://developer.pebble.com/docs/c/Foundation/Timer/) (performing some task periodically).
* [Bluetooth Connection Service](https://developer.pebble.com/docs/c/Foundation/Event_Service/ConnectionService/) (monitoring the state of the connection).
* Sensors/Services: [Accelerometer](https://developer.pebble.com/docs/c/Foundation/Event_Service/AccelerometerService/), [Compass](https://developer.pebble.com/docs/c/Foundation/Event_Service/CompassService/), [Battery State](https://developer.pebble.com/docs/c/Foundation/Event_Service/BatteryStateService/) and [Health Services](https://developer.pebble.com/docs/c/Foundation/Event_Service/HealthService/).
* A series of videos ([1](https://www.youtube.com/watch?v=8tOhdUXcSkw) [2](https://www.youtube.com/watch?v=lYoHh19RNy4) [3](https://www.youtube.com/watch?v=ft1nplN-K5g)) on advanced programming techniques for Pebble. 
* Adding a [Stylish App Configuration](https://developer.pebble.com/tutorials/intermediate/slate/).
* The [GeoLocation API Specification](https://dev.w3.org/geo/api/spec-source.html) (relevant to the smartphone component of the Pebble app which collects GeoLocation data).

## Proxy Server

In order to enable students to build a simpler Game Server/Guide Agent (i.e., using only UDP sockets and not having to manage the complexities of TCP connections) we had to provide a *proxy* component that sits between the client and server and transfers data from one type of socket (WebSocket; Pebble companion devices can't open UDP sockets so they must use WebSockets) to another (UDP; the only communication that the Game Server supports). 

Thus, we provide students with a `WebSocket => UDP` server (implemented in Node.js) that acts as a proxy between the client (field agent) and target server (game server). The client uses the WebSocket protocol to talk to the proxy (via the companion smartphone) and the proxy uses UDP to direct traffic from a client to the target server. 

The target server can communicate back to the client via the proxy in the reverse direction (i.e., `UDP => WebSocket`).

As it is currently implementated there is no support to talk to our proxy server directly (i.e., all communications "with" the proxy are by way of a WebSocket from the client or a UDP socket from the target; such a UDP socket exists for each client connected over a WebSocket to the Proxy).

### Background: Node.js & WebSockets

* We use [Node.js](https://nodejs.org/api/) to implement the Proxy Server.
* We use the built-in [UDP/Datagram Sockets](https://nodejs.org/api/dgram.html) for the communication over UDP. 
* We are using the [`ws`](https://github.com/websockets/ws) implementation for WebSockets in our Node.js Proxy Server to handle WebSocket communications.

### Setup

* Install Node.js (or update!)
* Ensure your `NODE_PATH` is set properly: [http://stackoverflow.com/a/14515868](http://stackoverflow.com/a/14515868). 
* Install [ws](https://github.com/websockets/ws), a simple and lightweight WebSocket implementation. You don't have to install it manually---in fact you shouldn't! Change into the `proxy` directory and install all of the project dependencies (includes `ws`; see `package.json` for others) by running:

    ```bash
    npm install # uses package.json to lookup dependencies and install them
    ```
    
    See the [Node.js documentation for installing dependencies with `package.json`](https://docs.npmjs.com/getting-started/using-a-package.json) for more information.

### Running the Proxy Server Locally (I.e., On Your Local Machine)

The primary setup you need to do is install [Node.js](https://nodejs.org/en/) and the [Node Package Manager (NPM)](https://www.npmjs.com/). On OS X this is (easy)!

```bash
$ brew install node
```

If you want to build/install Node.js on a different platform, see this very [short and sweet video](https://docs.npmjs.com/getting-started/installing-node) the [Node.js Downloads page](https://nodejs.org/en/download/). You might also be interested in seeing [how you can install Node.js via other package managers on other systems](https://nodejs.org/en/download/package-manager/) (e.g., Fedora, Windows).

Then run

```bash
node proxy
```

**Using the CS50 build proxy**

Node.js and NPM should already be installed on the CS Linux servers. Change into the `proxy` directory and run:

```bash
npm install
node proxy
```

## Target Server

*TODO ...*
