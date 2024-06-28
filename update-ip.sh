#!/bin/bash

# Get the current IP address of the system
current_ip=$(hostname -I | awk '{print $1}')

# Get the Fully Qualified Domain Name (FQDN) of the system
current_fqdn=$(hostname -f)

# Define the configuration file path
config_file="/opt/paperless/paperless.conf"

# Define the line to modify
line_to_modify="PAPERLESS_ALLOWED_HOSTS="

# Read the current value of PAPERLESS_ALLOWED_HOSTS from the config file
current_value=$(grep "^$line_to_modify" "$config_file" | cut -d '=' -f 2-)

# Check if the current IP address is already in the list
ip_present=false
if [[ "$current_value" == *"$current_ip"* ]]; then
    ip_present=true
fi

# Check if the FQDN is already in the list
fqdn_present=false
if [[ "$current_value" == *"$current_fqdn"* ]]; then
    fqdn_present=true
fi

# Prepare a new value with both IP address and FQDN
new_value="$current_value"
if ! $ip_present; then
    new_value="${new_value},${current_ip}"
fi
if ! $fqdn_present; then
    new_value="${new_value},${current_fqdn}"
fi

# Replace the line in the file with the updated value
sed -i "s|^$line_to_modify.*|$line_to_modify$new_value|g" "$config_file"

echo "Added current IP address $current_ip and FQDN $current_fqdn to $config_file."
