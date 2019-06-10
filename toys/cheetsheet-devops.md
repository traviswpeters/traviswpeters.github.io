---
layout: post
title: DevOps Cheatsheet
---

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

# Contribute to Open Source Software (Git)

- Fork a project (so you have your own copy).

- Clone your forked version of the project repository.

```bash
$ git clone URL-TO-FORKED-REPO
```

- Move into the repository and create a new branch.  

```bash
$ git checkout -b new-branch
```

- Make some changes locally & commit them.
- Push your changes to YOUR remote repository.  
*(You may choose to wait to push to your remote until AFTER you sync your repository with the upstream. See the following steps.)*

- Add the original repository as an `upstream` repository.

```bash
$ git remote add upstream URL-TO-ORIGINAL-REPO
```

- Sync your local repository with the `upstream` repository.

```bash
$ git fetch upstream
# -> commits to the master branch will be stored in a local branch called upstream/master.
$ git checkout master
$ git merge upstream/master
# -> merge any changes that were made in the original repository’s master branch 
#    with our local master branch
```

- Push your changes to YOUR remote repository.
- Create a Pull Request.  
*(Navigate to your forked repository, and press the “New pull request” button on your left-hand side of the page)*

***References:***

- https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github  
- https://www.digitalocean.com/community/tutorials/how-to-rebase-and-update-a-pull-request  
- https://www.digitalocean.com/community/tutorials/how-to-maintain-open-source-software-projects  
- https://www.digitalocean.com/community/tutorials/how-to-use-git-a-reference-guide

