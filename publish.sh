#!/bin/bash

gulp release

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

git add -u;
git commit --no-verify
git push
commitMessage = "$(git log -1 --pretty=%B)"
git tag -a v$PACKAGE_VERSION -m "Version $PACKAGE_VERSION:$commitMessage"
git push origin --tags

npm publish