---
layout: post
title: GNU Radio on OS X
published: true
tags: [software, research]
image:
  feature: gnuradio.png
  teaser: gnuradio.png
  credit: Wikipedia - GNURadio
---

> Specifically this post speaks to installing GNU Radio and the GNU Radio Companion on OS X 10.13 (High Sierra).

I've tried *many* approaches discussed online to install the GNU Radio software on OS X, with varying success.
The big issue I'm up against is that I don't want to install [MacPorts](https://www.macports.org) on my system
    due to reports of how it conflicts with [Homebrew](https://brew.sh), my preferred package manager on OS X.
I also tried a pre-built version of the GUI application
([GNURadio.app](https://github.com/cfriedt/gnuradio-for-mac-without-macports))
    but it was quite ugly and some menus seemed to be in another language (French?).
I know I know, beggars can't be choosers... but I am going to be a chooser.

## What Didn't Work

My preferred approach would be to use Homebrew to install GNU Radio.
If you don't have Homebrew already you can install it easily enough:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

The software itself seems to install fine using Homebrew (`brew install gnuradio`),
    however, the GNU Radio Companion (a.k.a. "GRC," the GUI front-end for constructing flowgraphs) is not built.
This [issue](https://github.com/Homebrew/homebrew-core/issues/9317)
    has been identified by others but no real solution has been proposed.

One issue seems to be due to a dependency on QT4 which retired from Homebrew support.
I've seen work-arounds for installing old versions of QT4 from other sources but I have no interest in such a solution.
Thus, I tried invoking `brew install gnuradio` with build options such as `--build-from-source`, `--with-pygtk`, and `--with-wxpython` in an attempt to build GRC using other GUI options.
This built GRC!
But some of my existing flowgraphs that relied on audio blocks didn't seem to work.

> Note: To learn about Software Defined Radios I've been following along with examples in
> the [Field Expedient SDR book series](http://www.fieldxp.com/home/).
> The first volume uses audio blocks heavily to describe signal processing techniques and
> to help readers familiarize themselves with the GNU Radio Companion.

Thus, it also seems that some dependencies marked as "optional" or "recommended" (see: `brew info gnuradio`),
    are really must-haves for me.

## What Worked

Attempting to leave no stone unturned, I looked at all of the recommended or optional options
    for installing GNU Radio through Homebrew and listed *all* options that seemed even remotely relevant (why not?).

```bash
$ brew options gnuradio
--with-doxygen   #<<< Doxygen is the de facto standard tool for generating documentation from annotated
	Build with doxygen support
--with-jack      #<<< Audio connection kit; It provides a basic infrastructure for audio applications to communicate with each other and with audio hardware.
	Build with jack support
--with-pygtk     #<<< PyGTK lets you to easily create programs with a graphical user interface using the Python programming language
	Build with pygtk support
--with-sdl       #<<< Simple DirectMedia Layer is a cross-platform development library designed to provide low level access to audio, keyboard, mouse, joystick, and graphics hardware via OpenGL and Direct3D.
	Build with sdl support
--with-sphinx-doc
	Build with sphinx-doc support
--with-wxpython   #<<< A cross-platform GUI toolkit for the Python language.
	Build with wxpython support
--without-portaudio
	Build without portaudio support
--without-python
	Build without python support
--without-uhd
	Build without uhd support
--HEAD
	Install HEAD version
```
I had already installed `python` with Homebrew and it looks like `portaudio` and `uhd` are included by default.
The required dependencies aren't listed here but will be installed by Homebrew if you don't already have them installed.

Alas, the command I issued that seems to have gotten me what I want:
```bash
$ brew install gnuradio --HEAD  --build-from-source --with-pygtk --with-jack --with-doxygen --with-sdl --with-wxpython
```

## References

The [GNU Radio MacInstall Instructions](https://wiki.gnuradio.org/index.php/MacInstall)
are Mac-specific instructions for installation.
Unfortunately, this was rather useless to me since I don't want to use MacPorts to install GNU Radio
(the recommended approach), nor do I want to build from source manually unless I really have to.

The [GNU Radio Build Instructions and Information](https://gnuradio.org/doc/doxygen/build_guide.html)
includes a lot of useful information, including a list of all of the dependencies and expected versions.
The [gnuradio page](http://braumeister.org/formula/gnuradio) on Formulae (the online package browser for Homebrew)
    contains similar information.

I also found various GitHub repositories that seemed to address related issues.
Many of them were last updated one year or more ago,
    calling into question their relevance for issues on a more recent OS such as High Sierra.
Some of the more useful repositories with related information include: [metacollin/homebrew-gnuradio](https://github.com/metacollin/homebrew-gnuradio),
[DJISDKUser/homebrew-core](https://github.com/DJISDKUser/homebrew-core/tree/SierraGnuradioQT4Fosphor).

The curious reader may also want to investigate specific PyQT issues.
This post is likely a good place to start:
[Brew install qt does not work on macOS Sierra](https://stackoverflow.com/questions/39690404/brew-install-qt-does-not-work-on-macos-sierra)
