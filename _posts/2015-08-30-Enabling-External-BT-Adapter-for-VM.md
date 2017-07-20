---
layout: post
title: Enabling an External Bluetooth Adapter for VirtualBox VM
---

Start by checking which Bluetooth kernel extensions (kexts) are currently loaded by running `kextstat` and filtering on bluetooth related kexts:

{% highlight bash %}
$ kextstat | grep -i bluetooth
{% endhighlight %}

After a bit of experimentation, I found that unloading the following kexts will successfully bring down the functionality of the built-in Bluetooth Controller:

{% highlight bash %}
$ sudo kextunload -b com.apple.iokit.BroadcomBluetoothHostControllerUSBTransport
$ sudo kextunload -b com.apple.iokit.CSRBluetoothHostControllerUSBTransport 
$ sudo kextunload -b com.apple.iokit.IOBluetoothHostControllerUSBTransport
{% endhighlight %}

We can verify that the kexts were successfully unloaded by running the command from above and confirming that they no longer appear as loaded kexts:

{% highlight bash %}
$ kextstat | grep -i bluetooth
{% endhighlight %}

***TODO:*** *instructions for configuring the VM.*

When complete with any Bluetooth-related work on the VM, we want to reload the kexts that we unloaded previously so that the Bluetooth service can work on the host machine again. To reload the kernel modules that were unloaded earlier we can simply use the `kextload` command --- loading the unloaded modules in reverse order due to dependencies:

{% highlight bash %}
$ sudo kextload -b com.apple.iokit.IOBluetoothHostControllerUSBTransport
$ sudo kextload -b com.apple.iokit.CSRBluetoothHostControllerUSBTransport
$ sudo kextload -b com.apple.iokit.BroadcomBluetoothHostControllerUSBTransport
{% endhighlight %}

And then, as before, we can confirm that the local Bluetooth Controller and Bluetooth service is back up:

{% highlight bash %}
$ kextstat | grep -i bluetooth
{% endhighlight %}

***NOTE:*** *Information in this post was originally found in an [old ticket](https://www.virtualbox.org/ticket/2372) found on the VirtualBox website.*

