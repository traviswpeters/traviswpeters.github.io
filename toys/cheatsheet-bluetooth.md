
# Bluetooth & BlueZ
A collection of Bluetooth (and BLE) reading, tutorials, projects, tools, etc..


**Table of Contents**  

1. [Reading](#reading)
1. [Projects](#projects)
1. [Apps](#apps)
1. [Equipment](#equipment)
1. [Install](#intall)
1. [Dev/Test](#devtest)
1. [Dev/Test Workflow](#devtest-workflow)
1. [Getting Started: Bluetooth Tools & Commands](#tools-and-commands)

<!-- NOTE: each item automatically numbered by its order in the list. -->

<div id='reading'/>
## Reading 

2018

- [BLE Advertising Primer](https://www.argenox.com/bluetooth-low-energy-ble-v4-0-development/library/a-ble-advertising-primer/) 
*(Includes a nice breakdown of Apple's iBeacon payload format - Included in Argenox's [BLE Library](https://www.argenox.com/library/bluetooth-low-energy/))*.

2017

- [Bluetooth Hacking Tools Comparison (2017)](https://duo.com/decipher/bluetooth-hacking-tools-comparison)
- [The Practical Guide to Hacking Bluetooth Low Energy](https://blog.attify.com/the-practical-guide-to-hacking-bluetooth-low-energy/) (2017?)

2016

- [Turning a Raspberry Pi 3 into a Bluetooth Low Energy peripheral (2016)](https://tobiastrumm.de/2016/10/04/turning-a-raspberry-pi-3-into-a-bluetooth-low-energy-peripheral/)
- [Understanding & Optimizing BLE Throughput (2016)](https://github.com/chrisc11/ble-guides/blob/master/ble-throughput.md)

2015

- [GATT Services and Characteristics - Chapter 4 of Getting Started with Bluetooth Low Energy by Davidson et al. (2015)](https://www.oreilly.com/library/view/getting-started-with/9781491900550/ch04.html)
- [Now I wanna sniff some Bluetooth: Sniffing and Cracking Bluetooth with the UbertoothOne](https://www.security-sleuth.com/sleuth-blog/2015/9/6/now-i-wanna-sniff-some-bluetooth-sniffing-and-cracking-bluetooth-with-the-ubertoothone)

2014

- [Introduction to Bluetooth Low Energy (2014)](https://learn.adafruit.com/introduction-to-bluetooth-low-energy/introduction)
- [Bluetooth Recon With BlueZ (2014)](https://blog.ice9.us/2014/02/bluetooth-recon-with-bluez.html)

Older

- [Bluetooth: ATT and GATT (2011)](https://epxx.co/artigos/bluetooth_gatt.html)
- [Linux BlueZ HOW TO (2001)](https://pub.tik.ee.ethz.ch/people/beutel/bluezhowto.pdf)
- [Interact with Bluetooth devices on the Web](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)

###### Tutorials/Working References

- [Blue Picking - Hacking Bluetooth Smart Locks (2017)](https://conference.hitb.org/hitbsecconf2017ams/materials/D2T3%20-%20Slawomir%20Jasek%20-%20Blue%20Picking%20-%20Hacking%20Bluetooth%20Smart%20Locks.pdf) *(Slides)* - Features tools & techniques: *BLE-Replay, GATTacker, MAC Address Spoofing*
- [BtleJuice: The Bluetooth Smart MitM Framework](https://speakerdeck.com/virtualabs/btlejuice-the-bluetooth-smart-mitm-framework?slide=12)
- [Bluetooth Class of Device (CoD) List in Binary & Hex](https://www.question-defense.com/tools/class-of-device-bluetooth-cod-list-in-binary-and-hex)

###### Bluetooth Specification

- [GATT Declarations](https://www.bluetooth.com/specifications/gatt/declarations/)
- [GATT Services](https://www.bluetooth.com/specifications/gatt/services/)
- [GATT Characteristics](https://www.bluetooth.com/specifications/gatt/characteristics/)
- [GATT Descriptors](https://www.bluetooth.com/specifications/gatt/descriptors/)
- [Company Identifiers](https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/)
- [Class of Device (CoD) / Baseband](https://www.bluetooth.com/specifications/assigned-numbers/baseband/)


<div id='projects'/>
## Projects (Mostly Linux)

###### Official Sources

**BlueZ:**

- BlueZ Source Tree: [https://git.kernel.org/pub/scm/bluetooth/bluez.git]()
- BlueZ Official Releases: [http://www.bluez.org]()

**BTstack:**

- Blue Kitchen's BTstack (lightweight BT stack for resource-constrained devices): [http://bluekitchen-gmbh.com/btstack/]()
	- [Protocols](http://bluekitchen-gmbh.com/btstack/protocols/)
	- [Profiles](http://bluekitchen-gmbh.com/btstack/profiles/)

###### Especially Useful for Research

My forks: 

- [**btsnoop**](https://github.com/traviswpeters/btsnoop)  - Parsing module for btsnoop packet capture files
- [**BluePy**](https://github.com/traviswpeters/bluepy) - Python interface to Bluetooth LE on Linux
- [**Armis - BlueBorne PoC Code**](https://github.com/traviswpeters/blueborne)

Replay tools, etc.:

- ==[**BLE-Replay**](https://github.com/nccgroup/BLE-Replay) - Parses hcidump to json, wraps into python BLE client for replay/fuzzing==
- ==[**BLESuite**](https://github.com/nccgroup/BLESuite) - Python package to make Bluetooth Low Energy (BLE) device communication more user friendly== 
- [**GATTacker**](https://github.com/securing/gattacker) ([http://gattack.io]()) - MitM, MAC Cloning, Dump/Replay, etc.
- [**BtleJuice**](https://github.com/DigitalSecurity/btlejuice) - Similar to GATTacker.

###### Other Bluetooth Tools

- [crackle](https://github.com/mikeryan/crackle/) - LE encryption exploit
*(exploits a flaw in the BLE pairing process that allows an attacker to guess or very quickly brute force the TK (Temporary Key) -> decrypted communications)* 
- [PyBT](https://github.com/mikeryan/PyBT) - Mike Ryan's Hackable Bluetooth Stack - kinda old though...
- [Adafruit BLE Sniffer (Python)](https://github.com/adafruit/Adafruit_BLESniffer_Python)
- [Ubertooth](https://github.com/greatscottgadgets/ubertooth)
- [bettercap](https://www.bettercap.org/installation/) (was "bleah"?)
- [Zephyr Bluetooth tools](https://docs.zephyrproject.org/latest/guides/bluetooth/bluetooth-tools.html)
- [Bluetooth Class of Device/Service Generator](http://bluetooth-pentest.narod.ru/software/bluetooth_class_of_device-service_generator.html)
- [Online UUID Generator](https://www.uuidgenerator.net) 


<div id='apps'/>
## Apps

*All (or at least most) of these can be found on the Google Play Store.*

###### Android Dev Apps

- Nordic Semiconductor's [nRF Connect for Mobile](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp)
- Punch Through's [Light Blue Explorer](https://play.google.com/store/apps/details?id=com.punchthrough.lightblueexplorer)
- [BLE Peripheral Simulator](https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral) 
*(on [GitHub](https://github.com/WebBluetoothCG/ble-test-peripheral-android))*

*Lesser-known BLE simulator projects...*

- [Ble Peripheral Simulator](https://play.google.com/store/apps/details?id=com.ble.peripheral.sim)
- [BLE Peripheral Tool](https://play.google.com/store/apps/details?id=com.tw.coffeemade.bleperipheraltool)
- [BLE Tool](https://play.google.com/store/apps/details?id=com.cozyoz.bletool)
- [CW BLE Peripheral Simulator](https://play.google.com/store/apps/details?id=com.vance.cwartist.cwsimulation)


###### Android SmartHealth Device Apps

- [Kardia](https://play.google.com/store/apps/details?id=com.alivecor.aliveecg)
- [Kinsa](https://play.google.com/store/apps/details?id=com.kinsa)
- [Omron TENS](https://play.google.com/store/apps/details?id=jp.co.omron.healthcare.tens)
- [OMRON HeartAdvisor](https://play.google.com/store/apps/details?id=com.omronhealthcare.heartadvisor)
- [OMRON connect US/CAN](https://play.google.com/store/apps/details?id=com.omronhealthcare.omronconnect)
- [iHealth MyVitals](https://play.google.com/store/apps/details?id=iHealthMyVitals.V2)

###### Android SmartHome Device Apps

- [Engbird](https://play.google.com/store/apps/details?id=com.inkbird.engbird)  
- [Awair](https://play.google.com/store/apps/details?id=co.bitfinder.awair)   
- [Schlage Home](https://play.google.com/store/apps/details?id=com.allegion.leopard)
- [August Home](https://play.google.com/store/apps/details?id=com.august.luna) 
- [(Amazon Alexa App)](https://play.google.com/store/apps/details?id=com.amazon.dee.app&rdid=com.amazon.dee.app)


<div id='equipment'/>
## Equipment

*Equipment to consider purchasing for research in the future?*

- [Nordic Semiconductor nRF51-DK](http://www.mouser.com/Search/ProductDetail.aspx?R=nRF51-DKvirtualkey57440000virtualkey949-NRF51-DK) - $40 
- [Ubertooth One](https://greatscottgadgets.com/ubertoothone/) - $120 
- [Beagle USB 12 Protocol Analyzer](https://www.totalphase.com/products/beagle-usb12/) - $400 
- [Small Bluetooth Adapters (Amazon)](https://www.amazon.com/s?k=bluetooth+dongle+linux&i=electronics&ref=nb_sb_noss_2) - \$5 - \$25 each
- [Parani-UD100 Bluetooth 4.0 Class1 USB Adapter, Exchangeable Antenna](http://www.senanetworks.com/ud100-g03.html?sc=14&category=3968) - $40 
- [Bluetooth accessories (e.g., antennas)](http://www.senanetworks.com/Home/sn-bluetooth-accessories/)
- [Ellisys Bluetooth Explorer All-in-One Bluetooth® Analysis System](https://www.ellisys.com/products/bex400/) - $17,500+


<div id='intall'/>
## Install

The easiest way to get started is to install the Linux Bluetooth stack (BlueZ):

```bash
sudo apt-get install bluez
```

Alternatively, you can install from source: 

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

### Stored Data on the Linux Bluetooth Host

[Where are bluetooth link keys stored in Ubuntu 14.10?](https://askubuntu.com/a/565977) 
*(you need root to read/write these files)*. 

```bash
# ADAPTER_ADDR is the address of your connected BT controller. 
# Within the directory are all of its known devices (e.g., REMOTE_DEVICE_ADDR/).

# - "info" contains keys, device metadata, etc. 
/var/lib/bluetooth/ADAPTER_ADDR/REMOTE_DEVICE_ADDR/info

# - "attributes" contains cached GATT service information.
/var/lib/bluetooth/ADAPTER_ADDR/REMOTE_DEVICE_ADDR/attributes
```

For example:

```
$ cat /var/lib/bluetooth/60\:03\:08\:8F\:51\:0F/FC\:18\:3C\:85\:88\:4F/info
[IdentityResolvingKey]
Key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (scrubbed)

[SlaveLongTermKey]
Key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (scrubbed)
Authenticated=2
EncSize=16
EDiv=0
Rand=0

[General]
Name=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (scrubbed)
Appearance=0x0040
AddressType=public
SupportedTechnologies=BR/EDR;LE;
Trusted=false
Blocked=false
Services=00001800-0000-1000-8000-00805f9b34fb;00001801-0000-1000-8000-00805f9b34fb;00001805-0000-1000-8000-00805f9b34fb;0000180a-0000-1000-8000-00805f9b34fb;0000180f-0000-1000-8000-00805f9b34fb;7905f431-b5ce-4e99-a40f-4b1e122d00d0;89d3502b-0f36-433a-8ef4-c502ad55f8dc;9fa480e0-4967-4542-9390-d343dc5d04ae;d0611e78-bbb4-4591-a5f8-487910ae4366;

[ServiceChanged]
CCC_LE=2
```

### Research Tools/Commands

```
./bt --scan --connect
./bt --scan --knownonly
./bt --parse --all
```

### Quick Reference (Most Used Tools/Commands)

```bash
# start the bluetooth service + see which BT devices are available
systemctl start bluetooth.service && hcitool dev
```

```bash
# In case of problems connecting to the device, stop and restart the bluetooth service
sudo systemctl stop bluetooth
sudo systemctl start bluetooth
```

```bash
# Fetch HCI log file from Android device 
# Another possible location? `/storage/emulated/legacy/btsnoop_hci.log`
# => See also: https://developer.android.com/studio/command-line/adb
adb pull /sdcard/btsnoop_hci.log
```


#### hciconfig

A tool to configure Bluetooth devices (i.e., the local Bluetooth Controller). 

```bash
hciconfig hci0 down
hciconfig hci0 up
hciconfig hci0 reset
```

#### hcitool

A tool to configure Bluetooth connections. 

The `hcitool` enables software to interact with the Bluetooth Controller over the Host Controller Interface (HCI). For example, the `hcitool` can be used to initiate scanning for nearby Bluetooth devices, creating connections with devices, configuring aspects of how the Host's Controller operates, and so forth. 

```bash
hcitool -i hciX        # specify the HCI interface to use. 
hcitool dev            # show adapter/see availabel Bluetooth devices (controllers)

hcitool lescan         # scan for BLE devices
hcitool leinfo ADDR    # info about ble device
hcitool lecc ADDR      # connect to a BLE device

# Send HCI Command
# hcitool cmd <ogf> <ocf> <args>

hcitool cmd 0x03 0x000d 0x01   # Read Stored Link Key (are 1+ keys stored in controller?)
hcitool cmd 0x04 0x0001        # Read Local Version Information 
hcitool cmd 0x04 0x0009        # Read bd_addr
hcitool cmd 0x08 0x0003        # LE Read Local Supported Features
hcitool cmd 0x08 0x0005 ADDR   # LE Set Random Address
```


#### gatttool

A tool for Bluetooth Low Energy devices. 

For example, `gatttool` makes it easy to discover the services and characteristics on nearby BLE devices. Most noteably, gatttool enables an interactive mode, whereby a human user can use the commandline to connect with a BLE device and interact with it. 

```bash
# Launch gatttool in interactive mode
gatttool -I
	connect <addr> # connect to a device in interatie mode

# Create an interactive connection with a specific Bluetooth device
# One thing to note: if you're trying to connect to a device using a random address,
# such as the FitBit Flex, you need to add the -t random command line flag.

sudo gatttool -b <BLE ADDRESS> -t random -I # connect to a specific device
# Ex. -> gatttool -b AA:BF:34:C0:95:FF -t private -I

# ONCE CONNECTED:
    primary                         # Get the primary UUIDs
    characteristic                  # Check for available (readable) characteristics
    char-desc                       # Descriptor discovery; + get all the available handles?
    char-read-hnd <handle>          # Read characteristic by handle
    char-write-req <handle> <data>  # Write to characteristic by handle
```

#### btmon

The BlueZ Bluetooth monitor. 
`btmon` monitors all traffic over the HCI. 
Observed traffic can be written to a file and read back in (processed/displayed) later. 
Also, `btmon` can present a live view in the terminal. 

```bash
# bluez 5.X version of hcidump (better and more modern)
btmon [--time|--date] 

# On Kali, write btmon capture session to file; read back in; view in hex. 
btmon --write logs/testscan.log
btmon --read logs/testscan.log

# btmon can also give high-level stats (# commands, #events, controller ADDR, etc.)
btmon --analyze logs/testscan.log 

```

You can also look at the log file in a binary/head editor:

```bash
xxd logs/testscan.log
```

#### bluetoothctl

An interactive Bluetooth control tool. 

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

#### btmgmt

A command-line interface of BlueZ for management. 

```bash
btmgmt le on
btmgmt bredr off
```

#### sdptool

A tool to control and interrogate SDP servers.

```bash
# NOTE: sdptool works even when the target device is not discoverable!
sdptool browse BDADDR # browse services
sdptool records BDADDR # more detailed browsing info
```


#### Python Tools

```bash
# bluepy
python btle.py xx:xx:xx:xx:xx:xx random

# NOTE: bluepy depends on the `bluepy-helper`, which interacts with bluez. 
# To explore the features of the bluepy-helper directly, run the executable: 
./bluepy-helper 0
le on
scan
quit
```
