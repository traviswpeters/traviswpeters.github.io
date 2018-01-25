# CS50 sharekey

This little tool allow a set of CS50 graders to share a single ssh key - a key that authenticates as the `cs50-17s` user on Gitlab.  All CS50 students grant that user access to their lab/project repo. Then, graders can use this ssh key to access student repos.

After cloning, immediately take these steps:

```
chmod 600 cs50-17s
cp cs50-17s $HOME/.ssh/
```

When working on grading for cs50,

  * `source cs50git.sh`
  * instead of `git clone`, use `cs50git clone`
  * instead of `git pull`, use `cs50git pull`

So, if given the URL for the TSE lab for student USERNAME, you would 

```
cs50git clone git@gitlab.cs.dartmouth.edu:$USERNAME/tse.git $USERNAME
```
