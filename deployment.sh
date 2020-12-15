#!/bin/sh
if [ `docker ps -f name=blue -q | wc -c` -ne 0 ]
then
    ENV="green"
    OLD="blue"
else
    ENV="blue"
    OLD="green"
fi

echo "Starting "$ENV" container"
docker-compose --project-name=$ENV up -d

echo "Waiting..."
sleep 45s

echo "Stopping "$OLD" container"
docker-compose --project-name=$OLD stop
