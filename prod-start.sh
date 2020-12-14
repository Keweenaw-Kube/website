#!/usr/bin/env sh

# Migrate database
npx prisma migrate up --experimental

# Start site
yarn start
