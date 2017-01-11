#!/bin/bash

gulp release

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

git add -u;
git commit -m "Release version $PACKAGE_VERSION" --no-verify
git push

git tag -a v$PACKAGE_VERSION -m "Version $PACKAGE_VERSION"
git push origin --tags

npm publish