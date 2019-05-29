---
layout: post
title: Tools Cheatsheet
---
*Tired of hunting for good cheatsheets. Made one that is useful to me.*


# Python
All things Python, pip, virtual environments, etc.

```bash
brew install python

# virtual environments
pip install virtualenv
virtualenv env
source env/bin/activate

# upgrade pip
python -m pip install --upgrade pip

# data science
pip install pandas scipy scikitlearn statsmodels sympy matplotlib jupyter

# ------------------------------------------------------ #
# --- other commands (list, show, search, uninstall) --- #
# ------------------------------------------------------ #

# list python modules in current environment
pip list
# see package metadata
pip show requests
# search for new python modules
pip search requests oauth
# uninstall python modules
pip uninstall certifi

# ---------------------------------------------------------- #
# --- saving/installing virtual environment dependencies --- #
# ---------------------------------------------------------- #

# capture requirements installed in the current environment
pip freeze > requirements.txt
# install requirements specified in a requirements file
pip install -r requirements.txt
pip install --upgrade -r requirements.txt
# uninstall requirements listed in the requirements file
pip uninstall -r requirements.txt -y
```

Avoid version conflicts with Virtual Environments:
```bash
# Virtual Environments ("virtualenvs") keep your project dependencies separated.
# They help you avoid version conflicts between packages and different versions
# of the Python runtime.

# Before creating & activating a virtualenv: `python` and `pip` map to the system
# version of the Python interpreter (e.g. Python 2.7)
$ which python
/usr/local/bin/python

# Let's create a fresh virtualenv using another version of Python (Python 3):
$ python3 -m venv ./venv

# A virtualenv is just a "Python environment in a folder":
$ ls ./venv
bin      include    lib      pyvenv.cfg

# Activating a virtualenv configures the current shell session to use the python
# (and pip) commands from the virtualenv folder instead of the global environment:
$ source ./venv/bin/activate

# Note how activating a virtualenv modifies your shell prompt with a little note
# showing the name of the virtualenv folder:
(venv) $ echo "wee!"

# With an active virtualenv, the `python` command maps to the interpreter binary
# *inside the active virtualenv*:
(venv) $ which python
/Users/dan/my-project/venv/bin/python3

# Installing new libraries and frameworks with `pip` now installs them *into the
# virtualenv sandbox*, leaving your global environment (and any other virtualenvs)
# completely unmodified:
(venv) $ pip install requests

# To get back to the global Python environment, run the following command:
(venv) $ deactivate

# (See how the prompt changed back to "normal" again?)
$ echo "yay!"

# Deactivating the virtualenv flipped the `python` and `pip` commands back to
# the global environment:
$ which python
/usr/local/bin/python
```

#### **Better? `pipenv`**
Pipenv has virtual environment management built in so that you have a single tool for your package management.

The problems that Pipenv seeks to solve are multi-faceted:

- You no longer need to use `pip` and `virtualenv` separately. They work together.
- Managing a `requirements.txt` file can be problematic,
so Pipenv uses `Pipfile` and `Pipfile.lock` to separate abstract dependency declarations from the last tested combination.
- Hashes are used everywhere, always. Security. Automatically expose security vulnerabilities.
- Strongly encourage the use of the latest versions of dependencies to minimize security risks arising from outdated components.
- Give you insight into your dependency graph (e.g. $ `pipenv graph`).
- Streamline development workflow by loading `.env` files.

```bash
# install pipenv... and then forget about pip!
brew install pipenv
#vs.
pip install pipenv  
# - Pipfile (replaces requirements.txt)
# - Pipfile.lock (enables deterministic builds)

###
### See: https://pipenv.readthedocs.io/en/latest/advanced/#configuration-with-environment-variables
###

# WHERE stuff is
pipenv --where
pipenv --venv

# EXPLICITLY Spawn a shell in a virtual environment to isolate the development of this app.
# This will create a virtual environment if one doesn’t already exist.
# Pipenv creates all your virtual environments in a default location.
pipenv shell

# OVERVIEW of commands
pip install pipenv
pipenv install flask==0.12.1
pipenv install numpy # install by package index
pipenv install -e git+https://github.com/requests/requests.git#egg=requests # install by source code on VCS (-e = editable)
pipenv install pytest --dev # dev only installs
pipenv install --ignore-pipfile # use Pipfile.lock (for a deterministic build); NOT Pipfile
pipenv install --dev # install all dev packages

pipenv lock # update Pipfile.lock (contains EXACT versions for deterministic builds)

pipenv uninstall pytest # uninstall packages
pipenv uninstall --all[-dev] # wipe all installed packages from virtual environment

pipenv install -r requirements.txt # install modules from requirements.txt file
pipenv lock -r > requirements.txt # Go the other way; save out a requirements.txt file

pipenv graph [--reverse] # show dependencies in current virtual environment

pipenv open MODULE # open module in editor
pipenv run <insert command here> # run a command in virtual environment
pipenv check # check for security vulnerabilities

# `pipenv shell` drops you into a subshell; to exit the subshell, simply use `exit`.
exit
```

```bash
# Install a local module in ‘pip develop’ mode;
# use relative path (e.g, in this example, pybluez is in current working directory)
pipenv install -e pygatt
pipenv install -e pybluez
# NOTE: WON'T WORK --- so long as this modules doesn't have a setup.py...
pipenv install -e btsnoop
```






# Auto-Environment Using `direnv` - https://direnv.net

From the project website:
> direnv is an environment switcher for the shell. It knows how to hook into bash, zsh, tcsh, fish shell and elvish to load or unload environment variables depending on the current directory. This allows project-specific environment variables without cluttering the ~/.profile file.
>
> Before each prompt, direnv checks for the existence of a ".envrc" file in the current and parent directories. If the file exists (and is authorized), it is loaded into a bash sub-shell and all exported variables are then captured by direnv and then made available to the current shell.
>
> Because direnv is compiled into a single static executable, it is fast enough to be unnoticeable on each prompt. It is also language-agnostic and can be used to build solutions similar to rbenv, pyenv and phpenv.

I find it useful to enable automatic virtual environment activation/deactivation when changing into/out of a folder with a Python virtual environment.

For example, in a Python project environment where I've used `pipenv` to create a virtual environment, I create a `.envrc` file with instructions to use the `pipenv` layout.
I also authorize `direnv` to execute the script in this directory.
Now, when I switch in/out of this directory, my virtual environment is automatically activated/deactivated.

```bash
echo layout_pipenv >> .envrc
direnv allow .
```







# Bluetooth & BlueZ

## Projects  

- BlueZ Source Tree: https://git.kernel.org/pub/scm/bluetooth/bluez.git
- BlueZ Official Releases: http://www.bluez.org
- Armis - BlueBorne PoC Code: https://github.com/traviswpeters/blueborne
- BluePy (Python interface to Bluetooth LE on Linux): https://github.com/IanHarvey/bluepy
- Zephyr Bluetooth tools: https://docs.zephyrproject.org/latest/guides/bluetooth/bluetooth-tools.html

## UUIDs

A universally unique identifier (UUID) is a 128-bit (16 bytes) number that is guaranteed (or has a high probability) to be globally unique.

To reconstruct the full 128-bit UUID from the shortened version, insert the 16-or 32-bit short value (indicated by xxxxxxxx , including leading zeros) into the **Bluetooth Base UUID**:
```
xxxxxxxx-0000-1000-8000-00805F9B34FB
```



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
sudo gatttool -b <BLE ADDRESS> -t random -I # connect to a specific device
#   ex. ->  gatttool -b AA:BF:34:C0:95:FF -t private -I
# ONCE CONNECTED
    primary #Get the primary UUIDs
    char-desc #Get all the available handles
    char-read-hnd <handle> #Read from a handle
    char-write-req <handle> <data> #Write to a handle
```










# Git

- Book: https://git-scm.com/book/en/v2  
- Guided Tutorial: http://gitimmersion.com
- Illustrations/Cheatsheet: https://sentheon.com/blog/git-cheat-sheet.html#.XIfXZy2ZPUI

Convert a subfolder into its own Git repository (then make it a submodule)  
https://gist.github.com/korya/9047870

Working with large files:  
- https://github.com/git-lfs/git-lfs
- https://sabicalija.github.io/git-lfs-intro/

```bash
git lfs
```

Cleaning up Git history

```bash
# cleaning git history (e.g., files bigger than 100 MB - GitHub’s limit)  
bfg --strip-blobs-bigger-than 100M FOLDER/
```

Pull Requests

```bash
# create a pull request which you may include into an email
git request-pull  
```










# Vagrant & VirtualBox

```bash
# Turn on verbose logging mode.
VAGRANT_LOG=info vagrant up
#vs.
vagrant up --debug
```

```bash
vagrant box list
vagrant ssh-config
```

```bash
# list VirtualBox VMs
VBoxManage list vms
# list host USB devices
VBoxManage list usbhost
```

```
# output from `VBoxManage list usbhost`

UUID:               dff4ac66-63fe-433c-a821-2b712e2ad7eb
VendorId:           0x18d1 (18D1)
ProductId:          0x4ee2 (4EE2)
Revision:           2.50 (0250)
Port:               2
USB version/speed:  0/Full
Manufacturer:       LGE
Product:            Nexus 5
SerialNumber:       064965ab0ac584f0
Address:            p=0x4ee2;v=0x18d1;s=0x00002cc5317b10c2;l=0x40132000
Current State:      Available

...

UUID:               0eb46fc2-293f-48e1-83ea-ac15bbb7035b
VendorId:           0x05ac (05AC)
ProductId:          0x8289 (8289)
Revision:           1.80 (0180)
Port:               3
USB version/speed:  0/Full
Manufacturer:       Apple Inc.
Product:            Bluetooth USB Host Controller
Address:            p=0x8289;v=0x05ac;s=0x00000069dfe20a3e;l=0x14330000
Current State:      Captured
```

```bash
# see VM info
VBoxManage showvminfo NAME
# add a USB filter
VBoxManage usbfilter add 1 --target NAME --name "Human Readable Name for Device" --vendorid VENDORID --productid PRODUCTID --manufacturer "MAN."
# remove the USB filter
VBoxManage usbfilter remove 0 --target NAME
```

Examples:
```bash
VBoxManage usbfilter add 0 --target cbe4bde4-2a95-459f-a96e-0684e3cd74d7 --name "TWP: Apple Inc. Bluetooth USB Host Controller" --vendorid 0x05ac --productid 0x8289 --manufacturer "Apple Inc."

VBoxManage usbfilter add 1 --target cbe4bde4-2a95-459f-a96e-0684e3cd74d7 --name "TWP: Android Nexus 5 SN:064965ab0ac584f0" --vendorid 0x18d1 --productid 0x4ee2 --manufacturer "LGE"

VBoxManage usbfilter add 2 --target cbe4bde4-2a95-459f-a96e-0684e3cd74d7 --name "TWP: BT USB Adapter (1) 4.0 SN:5CF3708A148F" --vendorid 0x0a5c --productid 0x21e8 --manufacturer "Broadcom Corp"
VBoxManage usbfilter add 3 --target cbe4bde4-2a95-459f-a96e-0684e3cd74d7 --name "TWP: BT USB Adapter (2) 4.0 SN:5CF3708CB7B6" --vendorid 0x0a5c --productid 0x21e8 --manufacturer "Broadcom Corp"
```

### Vagrant quick-start guide

```bash
# install homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install base tools
brew cask install virtualbox
brew cask install vagrant
vagrant plugin install vagrant-vbguest  # for managing VB guest additions

# (optional ssh tools - # NOTE: for ssh sharing + you need to sign up for an account: https://ngrok.com)
brew cask install ngrok   
vagrant plugin install vagrant-share

# setup a vagrant environment
mkdir vagrant-dev && cd $_
vagrant init ubuntu/trusty64   # or whatever base box you want
vagrant up
vagrant ssh
```

### Vagrant SSH

In the **Terminal:**
```bash
cd /path/to/project \
  && mkdir -p ssh-keys && cd ssh-keys \
  && ssh-keygen -m PEM -t rsa -b 4096 -f myvmkeys -C "vagrant//traviswp@gmail.com" && mv myvmkeys private && mv myvmkeys.pub public
```
You'll have to hit enter a couple of times to get the the passphrase prompts.

After this step you should have keys named 'public' and 'private' inside a directory named `ssh-keys/`.

In the **Vagrantfile** (Minimum Working Example):

```ruby
Vagrant.configure(2) do |config|
	config.vm.box = 'ubuntu/trusty64'

	# ssh settings
	config.ssh.insert_key = false
	config.ssh.private_key_path = ['ssh-keys/private', '~/.vagrant.d/insecure_private_key']
	config.vm.provision 'file', source: 'ssh-keys/public', destination: '~/.ssh/authorized_keys'
	config.vm.provision 'shell', inline: <<-EOC
		sudo sed -i -e "\\#PasswordAuthentication yes# s#PasswordAuthentication yes#PasswordAuthentication no#g" /etc/ssh/sshd_config
		sudo service ssh restart
	EOC
end
```

*NOTE: The Vagrantfile should be the parent of wherever your `ssh-keys/` directory is located.*










# Docker

***To minimize duplicate info, I keep a collection of Docker information & resources here:***
- ***https://github.com/traviswpeters/dockerfiles***

The intention of this page/section is really just to provide a quick command cheatsheet/reference.

```bash
# setup
brew install docker
docker run hello-world
```

```bash
# utility commands
docker info
docker container ls [-a]
docker image ls
docker ps -a
# find images in a registry (default: Docker registry)
docker search <image-name>
# push an image to a registry
docker push NAME

# pull a pre-built image
docker pull busybox
# start the container and run a command [rm the container after exit]
docker run busybox COMMAND [--rm]
#
docker run -it busybox sh
```

Docker will keep exited containers around until you remove them; to clean-up all "exited" containers:

```bash
docker rm $(docker ps -a -q -f status=exited)
#vs.
docker container prune
```
Similarly, to view "dangling" images (images with no tags) & clean up images:
```bash
# view them...
docker images -f "dangling=true"
# and remove them...
docker rmi $(docker images -f "dangling=true" -q)
```

#### Docker Security Notes
Containers are realized through a combination of **namespaces**, **control groups (cgroups)**.

#### Creating Images

We first need a `Dockerfile`.

Example:

```bash
# our base image
FROM python:3-onbuild

# specify the port number the container should expose
EXPOSE 5000

# run the application
CMD ["python", "./app.py"]
```

Then, instruct `docker` to build an image from the `Dockerfile`.
```bash
# The docker build command does the heavy-lifting of creating a Docker image from a Dockerfile.
docker build -t twpeters/catnip .
# + run, creating a port mapping.
docker run -p 5000:5000 twpeters/catnip
```

#### Dockerfile
The `Dockerfile` is a script with instructions on how to create a docker image.
The image is then used to create running containers.

**Example:**

```bash
# file: Dockerfile
FROM alpine:3.1

ADD build.sh /usr/bin/
RUN build.sh

ADD test.sh /tmp/
RUN /tmp/test.sh

ENTRYPOINT [ "sass" ]
```

```bash
# file: .dockerignore
.git/
node_modules/
dist/
```

#### Deploying to AWS

Before we can deploy our app to AWS we must publish our image on a registry which can be accessed by AWS.
There are many different [Docker registries](https://aws.amazon.com/ecr/) you can use
 (you can even [host your own](https://docs.docker.com/registry/deploying/)).
For now, let's use [Docker Hub](https://hub.docker.com) to publish the image. To publish, just type

```bash
# Log in to a Docker registry
docker login
# publish the image to the Docker Hub registry
docker push twpeters/catnip
#...
```

#### Extras

Use repo2docker to create a container based on all dependencies within a repository:
```bash
pip install jupyter-repo2docker
repo2docker [repo-link]
# => automatically creates a new docker image, installs all the required dependencies, and finally, launches a jupyter server in the environment
```

#### Docker & Data Science

```bash
# Download and run:
docker pull datascienceworkshops/data-science-at-the-command-line
docker run --rm -it datascienceworkshops/data-science-at-the-command-line

# To mount a volume and enable shared files (e.g., current directory) between container and host.
docker run --rm -it -v`pwd`:/data datascienceworkshops/data-science-at-the-command-line
```






# SSH

#### SSH commands

```bash
ssh         # provides a secure encrypted connection between two hosts over an insecure network.
ssh-keygen  # creates a key pair for public key authentication
ssh-copy-id # configures a public key as authorized on a server
ssh-agent   # agent to hold private key for single sign-on
ssh-add     # tool to add a key to the agent
scp         # file transfer client with RCP-like command interface
sftp        # file transfer client with FTP-like command interface
sshd        # OpenSSH server
```
#### Files

- [`~/.ssh/config`](https://www.ssh.com/ssh/config/) - SSH configuration file
- `~/.ssh/known_hosts` - server (public) keys (i.e., enables client to authenticate servers; used to prevent impersonation; see also: `/etc/ssh/known_hosts`)
- `~/.ssh/authorized_keys` - client (public) keys (i.e., enables server to authenticate clients)

#### Guide: Create, Install, and Test SSH Keys

```bash
# Create new key pair; by default, keys usually stored in ~/.ssh (you'll need to answer various questions)
ssh-keygen
# or, specify information upfront:
ssh-keygen -m PEM -t rsa -b 4096 -f myvagrantkey_rsa4096 -C "vagrant//traviswp@gmail.com"

# Log into the server host, and copy key(s) to the server; adds keys to the ~/.ssh/authorized_keys file.
#   -i Specifies the identity file that is to be copied (default is ~/.ssh/id_rsa)
#   'user' and 'host' are the identifiers needed to access the VM/machine you want to install the SSH keys into
ssh-copy-id -i ~/.ssh/myvagrantkey_rsa4096 user@host

# Test the key by trying to ssh into the machine now.
ssh -i ~/.ssh/myvagrantkey_rsa4096 user@host
```

Example:
```bash
# Setting up SSH on Kali Vagrant Box w/ Custom SSH Keys
# -----------------------------------------------------
# Given the nature of this VM (a hacker tool that lots of hackers use...) I don't want default access with default key.
# After bring up the machine once with the 'ssh-keys/pentest-env' identity, I create my own key-pair, install it, and
# remove 'ssh-keys/pentest-env' from ~/.ssh/authorized_keys (so it is not possible to ssh in with that identity)
# Edit these steps to your liking.

# Create your key and stash it in this repository on the host. (NOTE: only stash the key(s) here if the repository is private!)
mkdir -p ssh-keys && cd ssh-keys
ssh-keygen -m PEM -t rsa -b 4096 -f myvagrantkey_rsa4096 -C "vagrant//traviswp@gmail.com"

# Install your key (NOTE: you may need to edit the port) & log in:
ssh-copy-id -i myvagrantkey_rsa4096 root@127.0.0.1 -p 2222  
ssh -i myvagrantkey_rsa4096 root@127.0.0.1 -p 2222  

# Remove the pentest-env key from the guest's set of authorized keys:
sed -i.bak '/pentest-env/d' ~/.ssh/authorized_keys  

# Vagrantfile
# -----------
# By setting the private_key_path as it is below, vagrant will try to ssh into the guest using those private keys in that order.
# The last key is the DEFAULT key for vagrant boxes (it shouldn't actually give you access to this VM...).
# The second to last key is the DEFAULT key for the pentest box (it should no longer grant you ssh access to the VM if you followed the steps above).
# THe first key is THE NEW SSH KEY, which should be the only ssh key that grants access to the VM now.
kali.ssh.username = 'root'
kali.ssh.private_key_path = ["ssh-keys/myvagrantkey_rsa4096", "ssh-keys/pentest-env", "~/.vagrant.d/insecure_private_key"]
kali.ssh.insert_key = false # DO NOT INSERT A NEW KEY/REMOVE DEFAULT (INSECURE) KEY
```






# Working with Data

```bash
pip install csvkit
# OR brew info csvkit
cat FILE | csvlook
cat FILE | csvstat
csvjson FILE --indent 4

# randomly sample dataset
seq 10000 | sample -r 1% -d 1000 -s 5 | jq -c '{line: .}'

# show just the first 79 characters (columns) of each line
head -n 10 data/wiki.html | cut -c1-79
```






# Android & ADB

Commandline Tools: https://developer.android.com/studio/command-line
* https://developer.android.com/studio/command-line/adb
* https://developer.android.com/studio/command-line/logcat.html
* https://developer.android.com/studio/command-line/dumpsys.html

*Sanity Checking...*
- Make sure your USB cable for the phone is working well.
- `adb kill-server`
- `adb devices -l`

```bash
adb devices -l
adb logcat [-t <count>]

# capture & a screenshot
adb shell screencap /sdcard/screen.png
adb pull /sdcard/screen.png
```

Within an `adb` shell:
```bash
pm list packages [-f  | -s | -i]
pm list features
pm list users

screencap filename
```




# Contribute to Open Source Software (Git)

Based on:   

https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github

https://www.digitalocean.com/community/tutorials/how-to-rebase-and-update-a-pull-request

https://www.digitalocean.com/community/tutorials/how-to-maintain-open-source-software-projects

https://www.digitalocean.com/community/tutorials/how-to-use-git-a-reference-guide

1. Fork a project (so you have your own copy).
2. Clone your forked version of the project repository.
```bash
$ git clone URL-TO-FORKED-REPO
```
3. Move into the repository and create a new branch.  
```bash
$ git branch new-branch
$ git checkout new-branch
#vs.
$ git checkout -b new-branch
```
4. Make some changes locally & commit them.
5. Push your changes to YOUR remote repository. *(You may choose to wait to push to your remote until AFTER you sync your repository with the upstream. See steps 6-8.)*
6. Add the original repository as an `upstream` repository.
```bash
$ git remote add upstream URL-TO-ORIGINAL-REPO
```
7. Sync your local repository with the `upstream` repository.
```bash
$ git fetch upstream
# -> commits to the master branch will be stored in a local branch called upstream/master.
$ git checkout master
$ git merge upstream/master
# -> merge any changes that were made in the original repository’s master branch with our local master branch
```
8. Push your changes to YOUR remote repository.
9. Create a Pull Request. *(Navigate to your forked repository, and press the “New pull request” button on your left-hand side of the page)*
