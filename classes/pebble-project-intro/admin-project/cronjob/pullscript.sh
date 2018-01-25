#!/usr/bin/bash
# Author: Rui Liu

if [ $# -ne 1 ]
then
    echo "Usage: pullscript.sh path"
fi

PULL_PATH=$1

cd $PULL_PATH
git reset --hard master
git checkout master
git pull origin master
