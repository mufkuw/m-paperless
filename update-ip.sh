#!/bin/bash

# Get the current IP address of the system
current_ip=$(hostname -I | awk '{print $1}')

# Define the configuration file path
config_file="/opt/paperless/paperless.conf"

# Define the line to modify
line_to_modify="PAPERLESS_ALLOWED_HOSTS="

# Read the current value of PAPERLESS_ALLOWED_HOSTS from the config file
current_value=$(grep "^$line_to_modify" "$config_file" | cut -d '=' -f 2-)

# Check if the current IP address is already in the list
if [[ "$current_value" == *"$current_ip"* ]]; then
    echo "Current IP address $current_ip is already present in $config_file."
else
    # Append the current IP address to the line
    new_value="${current_value},${current_ip}"
    
    # Replace the line in the file with the updated value
    sed -i "s|^$line_to_modify.*|$line_to_modify$new_value|g" "$config_file"
    
    echo "Added current IP address $current_ip to $config_file."
fi