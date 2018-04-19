#!/bin/bash

# source code repo

git add .

git commit -m "update"

git push origin master

# blog repo

mkdocs build

cd site

git add .

git commit -m "auto update"

git push origin master
