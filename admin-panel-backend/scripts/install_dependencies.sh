#!/bin/bash
cd /home/ubuntu/admin-panel-backend

# Ensure node_modules exists and is writable
if [ ! -d "node_modules" ]; then
    mkdir node_modules
fi
if [ ! -w "node_modules" ]; then
    chmod -R 755 node_modules
fi
# Install dependencies
npm install
# Check if the installation was successful
if [ $? -ne 0 ]; then
    echo "npm install failed"
    exit 1
fi