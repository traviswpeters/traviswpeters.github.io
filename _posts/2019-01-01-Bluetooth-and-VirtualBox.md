---
layout: post
title: Configuring a VirtualBox VM to use an External Bluetooth Adapter
---

*Note this tutorial is intended for people running macOS.*

*The steps below have been tested on macOS High Sierra (10.13).*

## Bluetooth Setup - On Host (Mac)

To see the default configuration for Bluetooth services on your machine ("Host"):

```bash
cat /System/Library/LaunchDaemons/com.apple.bluetoothd.plist

# unload
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.bluetoothd.plist
# or load
sudo launchctl load /System/Library/LaunchDaemons/com.apple.bluetoothd.plist
```

### Steps (Host)

To use an external Bluetooth adapter (i.e., a Bluetooth dongle) from within a VM,
    it is first necessary to disable the built-in Bluetooth adapter.

1. **[Host]** Turn off Bluetooth via GUI. *(System Preferences > Bluetooth > Turn Bluetooth Off)*
2. **[Host]** Open a Terminal, then:

```bash
# check the status of any loaded kernel extensions (kexts)
kextstat | grep -i bluetooth
# unload Bluetooth kexts:
sudo kextunload -b com.apple.iokit.IOBluetoothHostControllerUSBTransport
sudo kextunload -b com.apple.iokit.BroadcomBluetoothHostControllerUSBTransport
# NOTE: it may be necessary to try to unload other kexts that show up with running `kextstat`

# check the status of any loaded kernel extensions (kexts)
kextstat | grep -i bluetooth
```

3. **[Host]** Boot VM (e.g., using Vagrant)
4. **[Host]** Open VirtualBox GUI Application. In VirtualBox,
    - select VM in left window of GUI;
    - select *Settings > Ports > USB*;  
    - select (or add): *Apple Bluetooth USB Host Controller*.

***NOTE:*** *Regarding this last step, if you just added the device to the VM for the first time, you may need to reboot the VM before it will see the Bluetooth Controller.*

### Potential Issues (Tickets on virtualbox.org)

- [Cannot attach bluetooth usb devices to guest OS from OSX host](https://www.virtualbox.org/ticket/2372).
**Solution:** Disable/unload kexts mentioned above...
- [VBoxManage showvminfo segfault in 6.0.x](https://www.virtualbox.org/ticket/18341).
**Solution:** use a more recent build from the [test builds page](https://www.virtualbox.org/wiki/Testbuilds) (Test build >= 128880 for VirtualBox 6.0 should contain fix).

### Steps (Guest = "VM")

1. Power the VM down.

2. In VirtualBox with the desired VM selected in the left pane, navigate to `Settings > Ports > USB`.
    - Within the USB menu, ensure that the "Enabled USB Controller" and "Enable USB 2.0 (EHCI) Controller" boxes are selected.
    - Also, Under "USB Filters," be sure to add the USB Bluetooth Controller that you have connected.
    - Click "OK".

3. Now, power the VM back on and log in.

***NOTE:*** *in my VM (http://sliim.github.io/pentest-env/), root password is toor*

4. **[Guest]** Within the VM, start the Bluetooth service.

```bash
# Check bluetooth status
systemctl status bluetooth.service

# vs. check the status of the Bluetooth kernel module.
lsmod | grep bluetooth
modinfo bluetooth

# (start the service if necessary)
systemctl start bluetooth.service
```
5. (Optional) On the Kali VM I didn't have systemd (and I wanted it);
if you have another system configuration tool you like more or systemd is already installed on your machine, you can skip this step.
See the [systemd systen and service manager documentation](https://wiki.debian.org/systemd#systemd_-_system_and_service_manager)
    and [this tutorial on using systemd](https://www.debian-tutorials.com/systemd-system-and-service-manager)
    for more information.
Install systemd as follows:

```bash
apt-get update
apt-get install systemd

# now it is possible to use the `systemctcl` interface to manage the system services.
systemctl status service_name
systemctl start service_name
systemctl stop service_name
```

## Other Useful VM Configurations

Other recommended resources detailing useful VirtualBox Virtual Machine configurations:

* [Accessing shared folders](http://www.howtogeek.com/75705/access-shared-folders-in-a-virtualbox-ubuntu-11.04-virtual-machine/)
* [Installing Users and Group Management Tool on Ubuntu 14.04](http://ubuntuhandbook.org/index.php/2014/05/install-users-groups-management-tool-ubuntu1404/)
* [Install Fedora 18 on VirtualBox](http://www.zealfortechnology.com/2013/01/install-fedora-18-on-virtualbox-with.html)
