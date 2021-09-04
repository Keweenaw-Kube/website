#!/bin/sh
echo "Building..."
docker-compose build

echo "Replacing container"
docker-compose up -d
