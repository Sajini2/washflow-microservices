#!/bin/bash

echo "Starting WashFlow project (Backend & Frontend)..."

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found. Using 'docker compose' instead."
    docker compose up --build
else
    docker-compose up --build
fi
