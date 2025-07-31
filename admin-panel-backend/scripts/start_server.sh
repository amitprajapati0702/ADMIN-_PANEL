#!/bin/bash
cd /home/ubuntu/admin-panel-backend
# stop pm2 if it's running
pm2 stop all

# Start the server
pm2 start npm --name "admin-panel" -- run dev
# Check if the server started successfully
if [ $? -ne 0 ]; then
    echo "pm2 start failed"
    exit 1
fi
# Save the pm2 process list
pm2 save
# Check if the save was successful
if [ $? -ne 0 ]; then
    echo "pm2 save failed"
    exit 1
fi
# Set pm2 to start on boot
pm2 startup
# Check if the startup was successful
if [ $? -ne 0 ]; then
    echo "pm2 startup failed"
    exit 1
fi
# Print success message
echo "Dependencies installed and server started successfully."