#!/bin/bash

# source code repo

git commit -a -m "update"

git push origin master

# blog repo

mkdocs build

cd site

git commit -a -m "auto update"

git push origin master
