#!/bin/bash

git add .
git commit -m 'update'
git push origin source
mkdocs gh-deploy -b master
