---
layout: post
title: Tools Cheatsheet
---
*Tired of hunting for good cheatsheets. Made one that is useful to me.*

# Python
...

# Git
...

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

```bash
docker run hello-world

docker container ls [-a]
docker image ls
docker ps -a

# start the container
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
