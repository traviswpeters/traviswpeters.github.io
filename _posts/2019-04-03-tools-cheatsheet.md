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

#### Better? `pipenv`
Pipenv has virtual environment management built in so that you have a single tool for your package management.

```bash
# install pipenv... and then forget about pip!
pip install pipenv  
# - Pipfile (replaces requirements.txt)
# - Pipfile.lock (enables deterministic builds)

pipenv --venv
pipenv --where

#
# https://pipenv.readthedocs.io/en/latest/advanced/#configuration-with-environment-variables
#

# Spawn a shell in a virtual environment to isolate the development of this app.
# This will create a virtual environment if one doesn’t already exist.
# Pipenv creates all your virtual environments in a default location.
pipenv shell

pipenv install flask==0.12.1
pipenv install numpy
pipenv install -e git+https://github.com/requests/requests.git#egg=requests
pipenv install pytest --dev

# Create/update your Pipfile.lock, which you’ll never need to (and are never meant to) edit manually.
# You should always use the generated file.
pipenv lock

# This tells Pipenv to ignore the Pipfile for installation and use what’s in the Pipfile.lock.
# Given Pipfile.lock, Pipenv will create the exact same environment you had when you ran pipenv lock
# (sub-dependencies and all).
pipenv install --ignore-pipfile

pipenv uninstall numpy
pipenv uninstall --all
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






# Vagrant

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

# see VM info
VBoxManage showvminfo NAME
# add a USB filter
VBoxManage usbfilter add 1 --target NAME --name "TWP: Apple Inc. Bluetooth USB Host Controller" --vendorid 0x05ac --productid 0x8289 --manufacturer "Apple Inc."
# remove the USB filter
VBoxManage usbfilter remove 0 --target NAME
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

**Get Images:**
* [Docker Hub](https://hub.docker.com/search?q=&type=image)
    * [Alpine Linux](https://alpinelinux.org) is often recommended as a base image. 

**Recommended Resources:**
* [*THE* Docker Cheatsheet :)](https://github.com/wsargent/docker-cheat-sheet)
* [Getting Started with Docker in Development](https://rock-it.pl/getting-started-with-docker-in-development/)
* [10 Docker Image Security Best Practices](https://snyk.io/blog/10-docker-image-security-best-practices/)
* [How to Write Excellent Dockerfiles](https://rock-it.pl/how-to-write-excellent-dockerfiles/)
* [Building Better Docker Images](https://jonathan.bergknoff.com/journal/building-better-docker-images/)

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

# Docker will keep exited containers around until you remove them;
# to clean-up all "exited" containers:
docker rm $(docker ps -a -q -f status=exited)
#vs.
docker container prune
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


# Data

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
