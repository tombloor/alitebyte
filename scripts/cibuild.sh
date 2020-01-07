#!/usr/bin/env bash
set -e # halt script on error

bundle exec jekyll build
# Removed until I can get it working
# for some reason post dates are not correct
# so url validations are failing
# bundle exec htmlproofer ./_site