# Python
All things Python, pip, virtual environments, etc.

A summary of the language and features: 

- https://medium.com/fintechexplained/everything-about-python-from-beginner-to-advance-level-227d52ef32d2  
- https://towardsdatascience.com/a-data-scientist-should-know-at-least-this-much-python-oop-d63f37eaac4d

Install/Setup: 

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



# Misc.

### [Working with Binary Data in Python](https://www.devdungeon.com/content/working-binary-data-python)

#### Little Helpful Things...

```python
# Getting the size of a file
import os
file_length_in_bytes = os.path.getsize("test.txt")
print(file_length_in_bytes)
```

```python
# Find out what byte order your system uses
import sys
print("Native byteorder: ", sys.byteorder)
```

```python
# diff.py - Do two files match?
# Exercise: Rewrite this code to compare the files part at a time so it
# will not run out of RAM with large files.
import sys

with open(sys.argv[1], 'rb') as file1, open(sys.argv[2], 'rb') as file2:
    data1 = file1.read()
    data2 = file2.read()

if data1 != data2:
    print("Files do not match.")
else:
    print("Files match.")
```

```python
# find_ascii_in_binary.py - Identify ASCII characters in binary files

import sys
from functools import partial

chunk_size = 1
with open(sys.argv[1], 'rb') as in_file:    
    for data in iter(partial(in_file.read, chunk_size), b''):
        x = int.from_bytes(data, byteorder='big')
        if (x > 64 and x < 91) or (x > 96 and x < 123) :
            sys.stdout.write(chr(x))
        else:
            sys.stdout.write('.')
```

#### Bytes to Integer

```python
# Create an int from bytes. Default is unsigned.
some_bytes = b'\x00\xF0'
i = int.from_bytes(some_bytes, byteorder='big')
print(i)
```

#### Hexadecimal

```python
# Starting with a hex string you can unhexlify it to bytes
deadbeef = binascii.unhexlify('DEADBEEF')
print(deadbeef)

# Given raw bytes, get an ASCII string representing the hex values
hex_data = binascii.hexlify(b'\x00\xff')  # Two bytes values 0 and 255

# The resulting value will be an ASCII string but it will be a bytes type
# It may be necessary to decode it to a regular string
text_string = hex_data.decode('utf-8')  # Result is string "00ff"
print(text_string)
```

#### Format Strings

*Format strings can be helpful to visualize or output byte values. Format strings require an integer value so the byte will have to be converted to an integer first.*

```python
a_byte = b'\xff'  # 255
i = ord(a_byte)   # Get the integer value of the byte

bin = "{0:b}".format(i) # binary: 11111111
hex = "{0:x}".format(i) # hexadecimal: ff
oct = "{0:o}".format(i) # octal: 377

print(bin)
print(hex)
print(oct)
```

### [Bit Manipulation](https://wiki.python.org/moin/BitManipulation)

```python
def testBit(int_type, offset):
    """testBit() returns a nonzero result, 2**offset, if the bit at 'offset' is one."""
    mask = 1 << offset
    return(int_type & mask)

def setBit(int_type, offset):
    """setBit() returns an integer with the bit at 'offset' set to 1."""
    mask = 1 << offset
    return(int_type | mask)

def clearBit(int_type, offset):
    """clearBit() returns an integer with the bit at 'offset' cleared."""
    mask = ~(1 << offset)
    return(int_type & mask)

def toggleBit(int_type, offset):
    """toggleBit() returns an integer with the bit at 'offset' inverted, 0 -> 1 and 1 -> 0."""
    mask = 1 << offset
    return(int_type ^ mask)
```

Bit Fields (E.g., for communication protocols)

```python
import ctypes
c_uint8 = ctypes.c_uint8

class Flags_bits( ctypes.LittleEndianStructure ):
    _fields_ = [
                ("logout",     c_uint8, 1 ),  # asByte & 1
                ("userswitch", c_uint8, 1 ),  # asByte & 2
                ("suspend",    c_uint8, 1 ),  # asByte & 4
                ("idle",       c_uint8, 1 ),  # asByte & 8
               ]

class Flags( ctypes.Union ):
    _anonymous_ = ("bit",)
    _fields_ = [
                ("bit",    Flags_bits ),
                ("asByte", c_uint8    )
               ]

flags = Flags()
flags.asByte = 0x2  # ->0010

print( "logout: %i"      % flags.bit.logout   )
# `bit` is defined as anonymous field, so its fields can also be accessed directly:
print( "logout: %i"      % flags.logout     )
print( "userswitch:  %i" % flags.userswitch )
print( "suspend   :  %i" % flags.suspend    )
print( "idle  : %i"      % flags.idle       )

# OUTPUT: 
# logout: 0
# logout: 0
# userswitch:  1
# suspend   :  0
# idle  : 0
```


### [Efficient way to swap bytes in python (StackOverflow Post)](https://stackoverflow.com/questions/36096292/efficient-way-to-swap-bytes-in-python)
```python
# original = bytes
original = bytearray([1,2,3,4])
original[0::2], original[1::2] = original[1::2], original[0::2]
```
