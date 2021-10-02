#!/usr/bin/env sh

# Migrate database
yarn migrations:run

# Start site
yarn start
