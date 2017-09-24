---
layout: post
title: Configuring a VirtualBox VM to use an External Bluetooth Adapter
---

To use an external Bluetooth adapter (i.e., a Bluetooth dongle) from within a VM, 
    it is first necessary to disable the built-in Bluetooth adapter. 
A brief tutorial on how to accomplish this was already covered in 
    ["Enabling an External Bluetooth Adapter for VirtualBox VMs."](Enabling-External-BT-Adapter-for-VM.html)
In this tutorial I'll review how to configure the VM itself. 

In my case the host machine is a MacBook Pro running OS X 10.10, and the guest VM is running Kali Linux 
    (various other Linux distros should work fine as well). 

Power the VM down.

In VirtualBox with the desired VM selected in the left pane, navigate to `Settings > Ports > USB`. 
Within the USB menu, ensure that the "Enabled USB Controller" and "Enable USB 2.0 (EHCI) Controller" boxes are selected. 
Also, Under "USB Filters," be sure to add the USB Bluetooth Controller which you have connected. 
Click "OK".

Now, power the VM back on and log in.

Next, check the status of the Bluetooth kernel module. 
{% highlight bash %}
lsmod | grep bluetooth
modinfo bluetooth
{% endhighlight %}

On the Kali VM I didn't have systemd (and I wanted it); 
if you have another system configuration tool you like more or systemd is already installed on your machine, you can skip this step.
See the [systemd systen and service manager documentation](https://wiki.debian.org/systemd#systemd_-_system_and_service_manager)
    and [this tutorial on using systemd](https://www.debian-tutorials.com/systemd-system-and-service-manager)
    for more information. 
Install systemd as follows: 
{% highlight bash %}
apt-get update
apt-get install systemd
{% endhighlight %}

This will install the systemd packages but will not configure systemd as your init system 
    (instructions for this are outside of the scopeo of this post). 
Now it is possible to use the `systemctcl` interface to manage the system services. 

{% highlight bash %}
systemctl status service_name
systemctl start service_name
systemctl stop service_name
{% endhighlight %}

Other recommended resources detailing useful VirtualBox Virtual Machine configurations: 

* [Accessing shared folders](http://www.howtogeek.com/75705/access-shared-folders-in-a-virtualbox-ubuntu-11.04-virtual-machine/)
* [Installing Users and Group Management Tool on Ubuntu 14.04](http://ubuntuhandbook.org/index.php/2014/05/install-users-groups-management-tool-ubuntu1404/)
* [Install Fedora 18 on VirtualBox](http://www.zealfortechnology.com/2013/01/install-fedora-18-on-virtualbox-with.html)

