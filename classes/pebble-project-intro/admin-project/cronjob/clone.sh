#!/usr/bin/bash
# Author: Rui Liu
# usage: clone_all.sh CLONE_TAG

# CLONE_TAG is 00h, 24h, 48h, 72h for scheduled cronjobs

if [ $# -ne 1 ]
then
    echo "usage: clone_all.sh CLONE_TAG"
    exit 1
fi

CLONE_BASE="/net/class/cs50/labs/clones/project"
CLONE_TAG=$1

CLONE_PATH="$CLONE_BASE/$CLONE_TAG"

eval $(ssh-agent -s)
ssh-add "$HOME/.ssh/cs50-17s"

# List all the repos in the following format
git clone git@gitlab.cs.dartmouth.edu:USERNAME/PROJECTNAME.git $CLONE_PATH/PROJECTNAME >> /net/class/cs50/labs/grading/project/log-$CLONE_TAG.txt 2>&1

echo "Project repos saved to $CLONE_PATH"
echo "LOG saved to >> /net/class/cs50/labs/grading/project/log-$CLONE_TAG.txt"
