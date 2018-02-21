#!/bin/bash

mkdocs build

cd site

git add .

git commit -m "auto update"

git push origin master
