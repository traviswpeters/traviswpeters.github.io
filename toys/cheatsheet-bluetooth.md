# Bluetooth & BlueZ
A collection of Bluetooth (and BLE) reading, tutorials, projects, tools, etc..

**Table of Contents**  

1. [Reading](#reading)
2. [Projects](#projects)
3. [Apps](#apps)
4. [Install](#intall)
5. [Dev/Test](#devtest)
6. [Dev/Test Workflow](#devtest-workflow)
7. [Getting Started: Bluetooth Tools & Commands](#tools-and-commands)
8. [Concepts & Definitions](#concepts-and-definitions)
9. [Glossary](#glossary)

<div id='reading'/>
## Reading 

- [Bluetooth: ATT and GATT](https://epxx.co/artigos/bluetooth_gatt.html)
- [BLE Advertising Primer](https://www.argenox.com/bluetooth-low-energy-ble-v4-0-development/library/a-ble-advertising-primer/) *(Includes a nice breakdown of Apple's iBeacon payload format)* --- Included in Argenox's [BLE Library](https://www.argenox.com/library/bluetooth-low-energy/).
- [Turning a Raspberry Pi 3 into a Bluetooth Low Energy peripheral (2016)](https://tobiastrumm.de/2016/10/04/turning-a-raspberry-pi-3-into-a-bluetooth-low-energy-peripheral/)
- [GATT Services and Characteristics - Chapter 4 of Getting Started with Bluetooth Low Energy by Davidson et al. (2015)](https://www.oreilly.com/library/view/getting-started-with/9781491900550/ch04.html)
- [Introduction to Bluetooth Low Energy (2014)](https://learn.adafruit.com/introduction-to-bluetooth-low-energy/introduction)
- [Bluetooth Recon With BlueZ (2014)](https://blog.ice9.us/2014/02/bluetooth-recon-with-bluez.html)
- [Linux BlueZ HOW TO (2001)](https://pub.tik.ee.ethz.ch/people/beutel/bluezhowto.pdf)
- [Interact with Bluetooth devices on the Web](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)

###### Tutorials/Working References

- [Blue Picking - Hacking Bluetooth Smart Locks (2017)](https://conference.hitb.org/hitbsecconf2017ams/materials/D2T3%20-%20Slawomir%20Jasek%20-%20Blue%20Picking%20-%20Hacking%20Bluetooth%20Smart%20Locks.pdf) *(Slides)* --- Features tools & techniques: *BLE-Replay, GATTacker, MAC Address Spoofing*
- [BtleJuice: The Bluetooth Smart MitM Framework](https://speakerdeck.com/virtualabs/btlejuice-the-bluetooth-smart-mitm-framework?slide=12)
- [Bluetooth Class of Device (CoD) List in Binary & Hex](https://www.question-defense.com/tools/class-of-device-bluetooth-cod-list-in-binary-and-hex)

###### Spec

- GATT Declarations - https://www.bluetooth.com/specifications/gatt/declarations/
- GATT Services - https://www.bluetooth.com/specifications/gatt/services/
- GATT Characteristics - https://www.bluetooth.com/specifications/gatt/characteristics/
- GATT Descriptors - https://www.bluetooth.com/specifications/gatt/descriptors/
- Company Identifiers - https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/
- Class of Device (CoD) / Baseband - https://www.bluetooth.com/specifications/assigned-numbers/baseband/

<div id='projects'/>
## Projects

*(Mostly for Linux)*

###### Official Sources

- BlueZ Source Tree: https://git.kernel.org/pub/scm/bluetooth/bluez.git
- BlueZ Official Releases: http://www.bluez.org

###### Especially Useful for Research

- **btsnoop: https://github.com/joekickass/python-btsnoop** --- (fork) https://github.com/traviswpeters/btsnoop
- BLESuite: https://github.com/nccgroup/BLESuite
- **BLE-Replay: https://github.com/nccgroup/BLE-Replay --- Parses hcidump to json, wraps into python BLE client for replay/fuzzing.**
- Armis - BlueBorne PoC Code: https://github.com/ArmisSecurity/blueborne --- (fork) https://github.com/traviswpeters/blueborne
- **GATTacker: https://github.com/securing/gattacker (http://gattack.io) --- MitM, MAC Cloning, Dump/Replay, etc.**
- **BtleJuice: https://github.com/DigitalSecurity/btlejuice**
- crackle: https://github.com/mikeryan/crackle/ --- exploits a flaw in the BLE pairing process that allows an attacker to guess or very quickly brute force the TK (Temporary Key) -> decrypted communications

###### Other Tools

- BluePy (Python interface to Bluetooth LE on Linux): https://github.com/IanHarvey/bluepy --- (fork) https://github.com/traviswpeters/bluepy
- PyBT (Mike Ryan's Hackable Bluetooth Stack - kinda old though...) - https://github.com/mikeryan/PyBT
- Adafruit BLE Sniffer (Python) - https://github.com/adafruit/Adafruit_BLESniffer_Python
- Ubertooth - https://github.com/greatscottgadgets/ubertooth
- bettercap (was "bleah"?): https://www.bettercap.org/installation/
- Zephyr Bluetooth tools: https://docs.zephyrproject.org/latest/guides/bluetooth/bluetooth-tools.html
- Bluetooth Class of Device/Service Generator - http://bluetooth-pentest.narod.ru/software/bluetooth_class_of_device-service_generator.html
- Online UUID Generator: https://www.uuidgenerator.net


<div id='apps'/>
## Apps

###### Android Dev Apps

- BLE Peripheral Simulator -
https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral
- nRF Connect for Mobile -
https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp

###### Android SmartHealth Device Apps

- Kardia - https://play.google.com/store/apps/details?id=com.alivecor.aliveecg
- Kinsa - https://play.google.com/store/apps/details?id=com.kinsa
- Omron TENS - https://play.google.com/store/apps/details?id=jp.co.omron.healthcare.tens
- OMRON HeartAdvisor - https://play.google.com/store/apps/details?id=com.omronhealthcare.heartadvisor
- OMRON connect US/CAN - https://play.google.com/store/apps/details?id=com.omronhealthcare.omronconnect
- iHealth MyVitals - https://play.google.com/store/apps/details?id=iHealthMyVitals.V2

###### Android SmartHome Device Apps

- Engbird - https://play.google.com/store/apps/details?id=com.inkbird.engbird  
- Awair - https://play.google.com/store/apps/details?id=co.bitfinder.awair  
- Schlage Home - https://play.google.com/store/apps/details?id=com.allegion.leopard
- August Home https://play.google.com/store/apps/details?id=com.august.luna
- (Amazon Alexa App) - https://play.google.com/store/apps/details?id=com.amazon.dee.app&rdid=com.amazon.dee.app


<div id='intall'/>
## Install

Example instructions:
https://learn.adafruit.com/install-bluez-on-the-raspberry-pi/installation

*NOTE: You may need to update software versions.*

Install dependencies:

```bash
# Something not installed that you need? Try:
#   `apt-cache search KEYWORD`

sudo apt-get update
sudo apt-get -y install build-essential libusb-dev libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev valgrind \
    libtool libelf-dev libdw-dev libjson-c-dev alsa-utils libasound2-dev libsbc-dev libsdl-dev libspeexdsp-dev libell-dev #  extras that I needed.......WTF bluez docs?!
sudo apt-get -y install python-dev python-pip python-dbus
sudo pip install pexpect
```

Get the `bluez` source code:

```bash
cd ~

#Get a specific version:
wget http://www.kernel.org/pub/linux/bluetooth/bluez-5.33.tar.gz
tar xvfz bluez-5.33.tar.gz # vs. tar xf bluez-5.33.tar.xz
cd bluez-5.33

#Get the official repo:
git clone git://git.kernel.org/pub/scm/bluetooth/bluez.git
cd bluez
```

`make` bluez w/ options for better hacking/dev:

```bash
# configure & build
/bootstrap-configure --disable-mesh --disable-btpclient && make
# Generally, you can run
#   ./bootstrap-configure
#    make
# The explicitly-disabled options were causing issues (re: embedded linux); I don't need them, so remove them!
#    --enable-mesh \
#   --enable-btpclient \
# NOTE: automatically enables all the features of interest
# NOTE: runs `./configure --enable-maintainer-mode` which removes need to use `make install` when testing `bluetoothd`

#(optional; run self-tests)
make check
```

Extra steps (not necessary; at this point you should have all the bluez software built)

```bash
#(optional; check installation)
make install DESTDIR=$PWD/x
find x
rm -rf x
#(optional; check distribution)
make distcheck
# install
sudo make install
# remove autogenerated files
make maintainer-clean
```

Some hacking options:

```bash
# Copy configuration file which specifies the required security policies
sudo cp ./src/bluetooth.conf /etc/dbus-1/system.d/

# Run daemon in foreground with debugging
sudo ./src/bluetoothd -n -d -f ./src/main.conf
```

```bash
systemctl status bluetooth      # check status
sudo systemctl start bluetooth  # start
sudo systemctl stop bluetooth   # stop

sudo systemctl enable bluetooth # enable bluez to run @ boot
sudo systemctl disable bluetooth
```

<div id='devtest'/>
## Dev/Test

When building and testing directly from the repository it is important to
have at least automake version 1.10 or later installed.

**bluez `bootstrap` script**  
The basic scripts that uses the
autotools scripts to create the needed files for building and installing.
It makes sure to call the right programs depending on the usage of shared or
static libraries or translations etc.

**bluez `bootstrap-configure` script**  
This program will make sure to properly clean the repository, call the "bootstrap" script
*and then call configure with proper settings for development.*
It will use the best options and pass them over to configure.
These options normally include the enabling the *maintainer mode* and the *debugging features*.

**bluez `configure` script**  
So while in a normal source project the call `./configure ...` is used to
configure the project with its settings like prefix and extra options. In
case of bare repositories call "./bootstrap-configure" and it will bootstrap
the repository and calls configure with all the correct options to make
development easier.

In case of preparing for a release with `make distcheck`, don't use
`bootstrap-configure` since it could export development specific settings.

<div id='devtest-workflow'/>
## Dev/Test Workflow

The normal steps to checkout, build and install such a repository is like this:

```bash
# Install necessary dev packages
sudo apt-get update
sudo apt-get install -y libusb-dev libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev

# Checkout repository
git clone git://git.kernel.org/pub/scm/bluetooth/bluez.git
#vs. http://www.kernel.org/pub/linux/bluetooth/bluez-5.43.tar.xz
cd bluez

# Configure and build
./bootstrap-configure
make

# Run unit tests
make check

# Check installation
make install DESTDIR=$PWD/x
find x
rm -rf x

# Check distribution
make distcheck

# Final installation
sudo make install

# Remove autogenerated files
make maintainer-clean
```
Running from within the source code repository

```bash
# When using "./configure --enable-maintainer-mode" the automake scripts will
# use the plugins directly from within the repository. This removes the need
# to use "make install" when testing "bluetoothd". The "bootstrap-configure"
# automatically includes this option.

# Copy configuration file which specifies the required security policies
sudo cp ./src/bluetooth.conf /etc/dbus-1/system.d/

# Run daemon in foreground with debugging
sudo ./src/bluetoothd -n -d -f ./src/main.conf

# Run daemon with valgrind
#sudo valgrind --trace-children=yes --track-origins=yes --track-fds=yes \
#--show-possibly-lost=no --leak-check=full --suppressions=./tools/valgrind.supp \
#./src/bluetoothd -n -d -f ./src/main.conf
```

For production installations or distribution packaging it is important that
the "--enable-maintainer-mode" option is NOT used.

Note multiple arguments to `-d` can be specified, colon, comma or space
separated. The arguments are relative source code filenames for which
debugging output should be enabled; output shell-style globs are
accepted (e.g.: `plugins/*:src/main.c`).

<div id='tools-and-commands'/>
## Getting Started: Bluetooth Tools & Commands

```bash
# start the bluetooth service + see which BT devices are available
systemctl start bluetooth.service && hcitool dev
# see which Bluetooth devices (controllers) are available to use
hcitool dev

# perform a scan for BLE devices on controller 'hci0'
hcitool -i hci0 lescan

# create an interactive connection with a specific Bluetooth device
gatttool -i hci1 --primary -b MAC
# Ex. gatttool -i hci1 -b 00:22:D0:33:1E:0F -I

# HCI Command — READ Link Keys (used to generate tmp keys for OTA sessions)
#           <ogf>  <ocf> <args>
hcitool cmd 0x03 0x000D 0x01

# Linux — BT Device Info (+ Link Keys?) — <BDADDR> is the address of your connected BT controller; within the directory are all of its known devices.
/var/lib/bluetooth/<BDADDR>/

# Android — btsnoop_hci.log stored at /storage/emulated/legacy/btsnoop_hci.log — fetch it by running:
adb pull /storage/emulated/legacy/btsnoop_hci.log .
# => See also: https://developer.android.com/studio/command-line/adb
```

```bash
# bluepy
python btle.py xx:xx:xx:xx:xx:xx random
```

```bash
# In case of problems connecting to the device, stop and restart the bluetooth service
sudo systemctl stop bluetooth
sudo systemctl start bluetooth
```

```bash
btmon # bluez 5.X version of hcidump (better and more modern)
```

```bash
bluetoothctl
    power off
    power on
    agent on
    default-agent # used to ask for the pairing pin code
    scan on
    scan off
    info ADDR
    pair ADDR
    devices
    list-attributes ADDR
    select-attribute ATTR_PATH
        read
        attribute-info
        write 0x3 0x4 0x10 0x20 0x30 0x40
```

```bash
btmgmt le on
btmgmt bredr off
```

```bash
hciconfig hci0 down
hciconfig hci0 up
```

```bash
hcitool dev # show adapter
hcitool lescan # scan for BLE devices
hcitool leinfo ADDR
hcitool lecc ADDR
```

```bash
# One thing to note: if you're trying to connect to a device using a random address,
# such as the FitBit Flex, you need to add the -t random command line flag.

sudo gatttool -b <BLE ADDRESS> -t random -I # connect to a specific device
#   ex. ->  gatttool -b AA:BF:34:C0:95:FF -t private -I
# ONCE CONNECTED
    primary #Get the primary UUIDs
    char-desc #Get all the available handles
    char-read-hnd <handle> #Read from a handle
    char-write-req <handle> <data> #Write to a handle
```

```bash
# NOTE: sdptool works even when the target device is not discoverable!
sdptool browse BDADDR # browse services
sdptool records BDADDR # more detailed browsing info
```


<div id='concepts-and-definitions'/>
## Concepts & Definitions

Here is an illustration of the relationship between services, characteristics, descriptors, properties, and values. 
These terms are defined and discussed below. 
This figure is presented here as a reference. 

<center>
![](figs/BLE-ATT-and-GATT.png) 
</center>

### ATT & GATT
ATT is a wire application protocol, while GATT dictates how ATT is employed in service composition.

Every Low Energy profile must be based on GATT.

Therefore, ultimately, every LE service uses ATT as the application protocol.

###### ATT

The sole building block of ATT is the **attribute**.
An attribute is composed by three elements:

- a 16-bit **handle** *(just a number that uniquely identifies an attribute, since there may be many attributes with the same UUID within a device)*;
- a **UUID** which defines the attribute **type** *(ATT itself does not define any UUID. This is left to GATT and higher-level profiles.)*;
- a **value** of a certain **length** *(From the point of view of ATT, value is amorphous, it is an array of bytes of any size. The actual meaning of the value depends entirely on UUID, and ATT does not check if the value length is consistent with a given UUID etc.)*.

The **Attribute Protocol (ATT)** is a simple client/server stateless protocol based on attributes presented by a device. 
In BLE, each device is a client, a server, or both, irrespective of whether it’s a master or slave. 
A client requests data from a server, and a server sends data to clients. 
The protocol is strict when it comes to its sequencing: if a request is still pending 
(no response for it has been yet received) 
no further requests can be sent until the response is received and processed. 
This applies to both directions independently in the case where two peers are acting both as a client and server. 



An **ATT server** stores attributes.
An **ATT client** stores nothing; it uses the ATT wire protocol to read and write values on server attributes.
*Indeed, most of the ATT protocol is pure client-server: client takes the initiative, server answers.*
But ATT supports **notification** and **indication** capabilities, in which the server takes the initiative of notifying a client that an attribute value has changed, saving the client from having to poll the attribute.

ATT is very, *very* generic, and would leave too much for higher-level profiles to define.
Apart from the excess of freedom, there are some open issues, like: 
> **What if a device offers multiple services?**  

There is just one ATT handle space for each device, and multiple services must share the space in a cooperative way.
Fortunately, we have GATT, which shapes and delimits usage of attributes.

###### GATT

The **Generic Attribute Profile (GATT)** builds on the Attribute Protocol (ATT) 
and adds a hierarchy and data abstraction model on top of it. 
GATT is a base profile for ***all*** top-level LE profiles.
It defines how a bunch of ATT attributes are grouped together into meaningful services.

> In a way, it can be considered the backbone of BLE data transfer because it defines how data is organized and exchanged between applications. 

It defines generic data objects that can be used and reused by a variety of application profiles (known as GATT-based profiles ). It maintains the same client/server architecture present in ATT, but the data is now encapsulated in services , which consist of one or more characteristics . Each characteristic can be thought of as the union of a piece of user data along with metadata (descriptive information about that value such as properties, user-visible name, units, and more). 


> The cornerstone of a GATT service is the attribute with UUID equal to `0x2800` (which defines "primary services").

(There are secondary services, too (UUID `0x2801`), which are meant to be included by primary services.)
All attributes following this belong to that service, until another attribute `0x2800` is found.

Each attribute does not "know" by itself to which service it belongs.
GATT needs to figure it out based on handle ranges, and ranges are discovered solely on basis of UUID `0x2800` "cornerstones".

So, **each service definition attribute** has actually ***two UUIDs*** in its body: `0x2800` or `0x2801` as attribute UUID,
and another one stored in value, which specifies the service.

This sounds a bit confusing at first; two UUIDs to define a single service?
It is a result of layered GATT/ATT approach. 

> The UUID `0x2800`, which is well-known by GATT, is used to search for service boundaries.
Once they are found, the attributes are read and the second UUID (stored as value) specifies the service.
So a client may find all GATT services without knowing the specifics of e.g. a thermometer service.

###### Other Notes on ATT & GATT

***...some of which might be useful for parsing, modeling, etc.:***  

- There are fewer ATT/GATT implementations out there, which means less problems with suboptimal implementations and the accompanying interoperability issues (**bad software stacks plague Bluetooth Classic to this day**).
- There may be profiles for which ATT/GATT is not ideal as the application protocol.
**But there can always be a second L2CAP connection in parallel with ATT channel**, 
which in turn implements a profile-specific protocol.
- **Handle numbers are expected to be stable for each given device.** This allows clients to cache information, using less packets (and less energy) to retrieve attribute values after a first discovery. **Higher-level profiles specify how to "hint" a client that a server has changed attribute layout (e.g. after a firmware upgrade).**
	- ==Future Work: One concern in our work has been the question: how can models adapt over time to account for firmware upgrades, etc. The abilitity for an ATT server to inform an ATT client that handles have changed, etc. may be one approach. This should be done with caution, however, as an adversary may use this feature to maliciously adapt our models to avoid detection of malicious behavior.==
- The wire protocol **never sends value length**; **it is always implied from PDU size**, 
**and a client is expected to "know" the exact value layout for the UUID types it understands.**
Not sending value length explicitly saves bytes, which is particularly important in Low Energy, since MTU (maximum transmission unit) in LE is just 23 bytes.
	- ==Future Work: our passive monitor can enable "learning" insightful details about vendor-specific values.== 
- The small LE MTU is a problem for large attribute values. For those, ATT has "read long" and "write long" operations, which transfer big attributes in chunks.
	- ==Future Work: Long reads and writes (vs. normal reads and writes) may be another interesting feature.==
- **The ATT protocol is used for everything: discovering services, finding services' characteristics, reading/writing values, and so on.**
- **A typical BLE connection/intereaction sequence is**: (1) server (e.g., peripheral) advertises; (2) client (e.g., central) connects; (3) server notifies client when new data is available.
    - Once a connection is created, GATT communication can flow and notifications/indications can be delivered.
    - Once connected, **either side can establish a timeout for disconnection if no more notifications are received.**
The "best" timeout depends on the use case; 
**a service with infrequent notifications and no real-time pretensions may just disconnect immediately to save energy.**
Since BLE advertisement/reconnection mechanism is very fast — a major improvement from classic Bluetooth; 
**it is common/expected that most profiles will use a very short timeout or none at all.**
		- ==Future Work: Disconnection timeouts, which are application-specific, may be another interesting feature.==

### Services

A service is nothing more than a group of conceptually-related attributes in one common section of the attribute information set in the GATT server.

### Characteristics

The main characteristic attribute has UUID = `0x2803`.
As happens with services, this attribute has "double UUIDs": the generic one (0x2803) which allows for easy discovering,
and a more specific one which tells exactly which information the characteristic contains.

Each characteristic has at least two attributes:
***the main attribute (0x2803) and a value attribute that actually contains the value.***

The main attribute "knows" the value attribute's handle and UUID.
This allows for a certain degree of cross-checking.
The actual value format is entirely defined by its UUID.
So, if the client knows how to interpret the value UUID 0x2A08, it is capable of reading date and time from any service that contains such a characteristic.
On the other hand, if the client does not know how to interpret a certain value UUID, it may safely ignore it.

### Descriptor

Apart from value, it is possible to have more attributes defined within a characteristic, if we need them.
In GATT lingo, those extra attributes are called **descriptors**.

Each service may define its own descriptors, but GATT defines a set of standard descriptors that cover most cases, for example:
- Numeric format and presentation;
- Human-readable description;
- Valid range;
- Extended properties;
and so on.

One particularly important descriptor is the client characteristic configuration.

### Client Characteristic Configurations Descriptor (CCCD): `ATT Write Request` & `ATT Write Response`

This descriptor, whose UUID is 0x2902, has a read/write 16-bit value, which is meant to be a bitmap.
The first two bits of CCC are already taken by GATT specification.
They configure characteristic notification and indication.
The other bits might be used for other functions, but they are currently reserved.

Effectively, the first two bits act as a switch, enabling or disabling server-initiated updates; only for the characteristic in which this CCCD is encapsulated within.
A CCCD is nothing more than a 2-bit bitfield, with on bit corresponding to **notifications** and the other to **indications**.
A client can set/clear these bits at anytime (the server checks these bits whenever the relevant characteristic value changes).

To enable notifications or indications for characteristics that supports them, use `ATT Write Request` packet to set the corresponding bit to 1.
The server will reply with `ATT Write Response` packet and start sending the appropriate packets whenever it wants to alert the client of a change in value.

NOTEs:
- CCCD values are unique per connection (i.e., each connected client can set/clear their own set of CCCD bits).
- CCCD values are preserved across connections with bonded devices (i.e., the last value written is guaranteed to be restored upon reconnection, regardless of the time elapsed between connections).

***NOTE:***
GATT knows that CCC belongs to a particular characteristic because its handle falls into the range between one characteristic and the next.
And it knows it is CCCD because of the distinctive UUID (0x2902).


## BLE Advertising

When a BLE peripheral device is in advertising mode, advertising packets are sent periodically on each advertising channel.
The time interval between packet set has both a fixed interval and a random delay.
The interval is specified between the set of 3 packets (and 3 channels are almost always used).

You can set the fixed interval from 20ms to 10.24 seconds, in steps of 0.625ms.
The random delay is a pseudo-random value from 0ms to 10ms that is automatically added.
This randomness helps reduce the possibility of collisions between advertisements of different devices
(if they fell in the same rate, they could interfere more easily).

Despite the wide range supported for the advertising interval, most products use the following as a guideline:
- Less than 100ms - for very aggressive connections and usually for short periods of time
- 100ms to 500ms - normal fast advertising for most devices
- 1000ms to 2000ms for devices that connect to gateways and where latency is not critical

Most devices actually create a more complex system for advertising, using a Fast and Slow advertising regimes.
The device boots up or is told to start advertising at a fast rate because the user has interacted with it.
This is done for a limited amount of time to provide fast response when the user is expecting a quick connection.
After some pre-determined time, when no connection has occurred,
the device then switches to a slow advertising rate which allows an app to connect,
but limits the power consumption since the user may take some time to connect.

##### BLE Advertising Packets

- The Packet data unit for the advertising channel (called the **Advertising Channel PDU**) includes a 2-byte header and a variable payload from 6 to 37 bytes. The actual length of the payload is defined by the 6-bit Length field in the header of the Advertising Channel PDU.
- **ADV\_IND** is a generic advertisement and usually the most common. It’s generic in that it is not directed and it is connectable, meaning that a central device can connect to the peripheral that is advertising, and it is not directed towards a particular Central device. When a peripheral device sends an ADV_IND advertisements, it is helping Central devices such as Smartphones find it. Once found, a Central device can begin the connection process.
- **ADV\_NONCONN\_IND** is the advertisement type used when the peripheral does not want to accept connections, which is typical in Beacons.

## UUIDs

A universally unique identifier (UUID) is a 128-bit (16 bytes) number that is guaranteed (or has a high probability) to be globally unique.
For example:

```
75BEB663-74FC-4871-9737-AD184157450E
```

It's typical to arrange the UUID in the format above (4-2-2-2-6).
Each pair of characters actually indicate a hexadecimal number. (So the 75 above is actually 0x75.)

To avoid constantly transmitting 16 bytes which can be wasteful
(Bluetooth is very limited in the amount of data and 16 bytes are significant),
the Bluetooth SIG has adopted a **standard UUID base**/**Bluetooth Base UUID**.
This base forms the first 96 bits (12 bytes)  of the 128-bit UUID. The rest of the bits are defined by the Bluetooth SIG:

```
XXXXXXXX-0000-1000-8000-00805F9B34FB
```

The remaining 32-bits are up to you.

In general, to reconstruct the full 128-bit UUID from the shortened version,
insert the 16-or 32-bit short value (indicated by XXXXXXXX  including leading zeros) into the Bluetooth Base UUID.

For instance, for 16-bit UUIDs, the bottom 16-bits remain 0.
For example the short form 16-bit UUID for the Heart Rate Service is:

```
0x180D
```

In reality this represents a 128-bit UUID:

```
0000[180D]-0000-1000-8000-00805F9B34FB
```
*(The `[...]` around the 16-bits --- aka 2 bytes --- was added for clarity.)*

Thus, if you're using existing services or profiles that were specified by the Bluetooth SIG, you can avoid using the full 128-bit UUID.
**Custom services, however, need a fully defined 128-bit UUID.**


#### UUIDs You Should Know

```
UUID_primary_service (0x2800)  # denotes the start of a new service
UUID_characteristic (0x2803)   # denotes the start of a characteristic (encapsulated within a service)
UUID_cccd (0x2902)             # denotes the special Client Characteristic Configuration Descriptor
```

**Service UUIDs**

```
0x1800 # Generic Access - generic infomration about the device; all characteristics are read-only
       # > Characteristics: Device Name, Appearance

0x1801 # Generic Attribute 
       # > Characteristics: Service Changed [Indicate ONLY], CCCD [RW]  

0x180A # Device Information
```

**UUIDs specifically related to the Heart Rate Service:**

```
UUID_hr_service (0x0x180D)
UUID_hr_measurement (0x2A37)
```

Example GATT Service (Heart Rate Service) w/ UUIDs:

<center>
![](figs/BLE-ble-gatt-hr-service.png)
</center>


<div id='glossary'/>
## Glossary

Many of these definitions are taken from: 

> *Townsend, Kevin and Cufí, Carles and Akiba and Davidson, Robert.* ***Getting Started with Bluetooth Low Energy: Tools and Techniques for Low-Power Networking*** *(Kindle Locations 381-383). O'Reilly Media. Kindle Edition.*

### BLE 

*Common, generic terms...*

- **Attributes**—The smallest data entity defined by GATT (and ATT). They are addressable pieces of information that can contain relevant user data (or metadata ) about the structure and grouping of the different attributes contained within the server. 

- **Service**–A group of conceptually-related attributes in one common section of the attribute information set in the GATT server. 

- **Characteristics/Descriptors**–Containers for user data. They always include at least two attributes: the *_characteristic declaration_* (which provides metadata about the actual user data) and the *_characteristic value_* (which is a full attribute that contains the user data in its value field). Additionally, the characteristic value can be followed by descriptors, which further expand on the metadata contained in the characteristic declaration. The declaration, value, and any descriptors together form the characteristic definition , which is the bundle of attributes that make up a single characteristic. 

- **Universally Unique Identifier (UUID)**–A 128-bit (16 bytes) number that is guaranteed (or has a high probability) to be globally unique. UUIDs are used in many protocols and applications other than Bluetooth, and their format, usage, and generation is specified in ITU-T Rec. X.667 , alternatively known as ISO/IEC 9834-8:2005. For efficiency, and because 16 bytes would take a large chunk of the 27-byte data payload length of the Link Layer, the BLE specification adds two additional UUID formats: 16-bit and 32-bit UUIDs. These shortened formats can be used only with UUIDs that are defined in the Bluetooth specification (i.e., that are listed by the Bluetooth SIG as standard Bluetooth UUIDs). 

- **Handle**–The attribute handle is a unique 16-bit identifier for each attribute on a particular GATT server. It is the part of each attribute that makes it addressable, and it is guaranteed not to change (with the caveats described in “Attribute Caching” ) between transactions or, for bonded devices, even across connections. 

- **Type**–The attribute type is nothing other than a UUID. This can be a 16-, 32-, or 128-bit UUID, taking up 2, 4, or 16 bytes, respectively. The type determines the kind of data present in the value of the attribute, and mechanisms are available to discover attributes based exclusively on their type 

- **Permissions**–Metadata that specify which ATT operations can be executed on each particular attribute and with which specific security requirements. 

- **Protocols**—Building blocks used by all devices conformant to the Bluetooth specification, protocols are the layers that implement the different packet formats, routing, multiplexing, encoding, and decoding that allow data to be sent effectively between peers. 

- **Profiles**—“Vertical slices” of functionality covering either basic modes of operation required by all devices (Generic Access Profile, Generic Attribute Profile) or specific use cases (Proximity Profile, Glucose Profile), profiles essentially define how protocols should be used to achieve a particular goal, whether generic or specific. — Think: Application Developer.

- **Generic Access Profile (GAP)**—Covering the usage model of the lower-level radio protocols to define roles, procedures, and modes that allow devices to broadcast data, discover devices, establish connections, manage connections, and negotiate security levels, GAP is, in essence, the topmost control layer of BLE. This profile is mandatory for all BLE devices, and all must comply with it. 

- **Generic Attribute Profile (GATT)**—Dealing with data exchange in BLE, GATT defines a basic data model and procedures to allow devices to discover, read, write, and push data elements between them. It is, in essence, the topmost data layer of BLE. The Generic Attribute Profile (GATT) builds on the Attribute Protocol (ATT) and adds a hierarchy and data abstraction model on top of it. In a way, it can be considered the backbone of BLE data transfer because it defines how data is organized and exchanged between applications. It defines generic data objects that can be used and reused by a variety of application profiles (known as GATT-based profiles ). It maintains the same client/server architecture present in ATT, but the data is now encapsulated in services , which consist of one or more characteristics . Each characteristic can be thought of as the union of a piece of user data along with metadata (descriptive information about that value such as properties, user-visible name, units, and more). 


- **Public Device Address**—This is the equivalent to a fixed, BR/EDR, factory-programmed device address. It must be registered with the IEEE Registration Authority and will never change during the lifetime of the device. 

- **Random Device Address**—This address can either be preprogrammed on the device or dynamically generated at runtime. It has many practical uses in BLE, as discussed in more detail in “Address Types” . 

- **Passive scanning**—The scanner simply listens for advertising packets, and the advertiser is never aware of the fact that one or more packets were actually received by a scanner. 

- **Active scanning**—The scanner issues a Scan Request packet after receiving an advertising packet. The advertiser receives it and responds with a Scan Response packet. This additional packet doubles the effective payload that the advertiser is able to send to the scanner, but it is important to note that this does not provide a means for the scanner to send any user data at all to the advertiser. 


*Role-related terms...*

- **ATT/GATT Client**–Sends requests to a server and receives responses (and server-initiated updates) from it. 

- **ATT/GATT Server**–Receives requests from a client and sends responses back. It also sends server-initiated updates when configured to do so, and it is the role responsible for storing and making the user data available to the client, organized in attributes. Every BLE device sold must include at least a basic GATT server that can respond to client requests, even if only to return an error response. 

- **Master**—A device that initiates a connection and manages it later. 

- **Slave**—A device that accepts a connection request and follows the master’s timing. 

- **Central (master)**—Repeatedly scans the preset frequencies for connectable advertising packets and, when suitable, initiates a connection. Once the connection is established, the central manages the timing and initiates the periodical data exchanges. 

- **Peripheral (slave)**—A device that sends connectable advertising packets periodically and accepts incoming connections. Once in an active connection, the peripheral follows the central’s timing and exchanges data regularly with it. 

- **Broacaster**—Sends nonconnectable advertising packets periodically to anyone willing to receive them. 

- **Observer**—Repeatedly scans the preset frequencies to receive any nonconnectable advertising packets currently being broadcasted. 

- **Advertiser**—A device sending advertising packets. 

- **Scanner**—A device scanning for advertising packets. 

### BLE Security Procedures

- **Pairing**—The procedure by which a temporary common security encryption key is generated to be able to switch to a secure, encrypted link. This temporary key is not stored and is therefore not reusable in subsequent connections. 

- **Bonding**—A sequence of pairing followed by the generation and exchange of permanent security keys, destined to be stored in nonvolatile memory and therefore creating a permanent bond between two devices, which will allow them to quickly set up a secure link in subsequent connections without having to perform a bonding procedure again. 

- **Encryption**—Re-establishment After a bonding procedure is complete, keys might have been stored on both sides of the connection. If encryption keys have been stored, this procedure defines how to use those keys in subsequent connections to re-establish a secure, encrypted connection without having to go through the pairing (or bonding) procedure again. 

### BLE Security Mechanisms 

- **Encryption**—This mechanism consists of the full encryption of all packets transmitted over an established connection. 

- **Privacy**—The privacy feature allows an advertiser to hide its public Bluetooth address by using temporary, randomly generated addresses that can be recognized by a scanner that is bonded with the advertising device. 

- **Signing**—With this mechanism, a device can send an unencrypted packet over an established connection that is digitally signed (i.e., the source of which can be verfied). 

> **Note:** ==Existing BLE security does not address the issues we raise in our work. For instance, when two devices A and B have previously bonded, and therefore have a pre-existing trust-relationship, the BLE Encryption feature does not protect the confidentiality of data sent between A and B. Similar arguments can be made for the BLE Privacy and BLE Signing features. Our work aims to enhance to awareness of trustworthiness between two or more devices that interact.== 

### BLE Security Keys

- **Long Term Key (LTK)** and **Master Identification Information (EDIV, Rand)** => Used for Encryption.

- **Identity Resolving Key (IRK)** and **Identity Address Information (Address Type, Bluetooth Device Address)** => Used for Privacy.

- **Connection Signature Resolving Key (CSRK)** => Used for Signing. 

> Each of these keys or key sets is asymmetrical and unidirectional: it can be used only in the same role configuration in which they were originally generated. If the devices wish to switch Link Layer roles (master and slave) in subsequent connections, then each side must distribute its own set of keys for each key type. Devices negotiate the number of keys distributed in each direction, which can range from zero to all three key types in each direction, for a total of six keys distributed between peers (three from slave to master and three from master to slave). 

