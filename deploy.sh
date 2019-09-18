#!/bin/bash

git add .
git commit -m 'update'
git push origin master
mkdocs gh-deploy -b master
