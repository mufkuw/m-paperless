#!/bin/bash

# Get the current IP address of the system
current_ip=$(hostname -I | awk '{print $1}')

# Get the Fully Qualified Domain Name (FQDN) of the system
current_fqdn=$(hostname -f)

# Define the configuration file path for both settings
paperless_conf="/opt/paperless/paperless.conf"

# Define the settings to modify
paperless_allowed_hosts="PAPERLESS_ALLOWED_HOSTS="
paperless_csrf_trusted_origins="PAPERLESS_CSRF_TRUSTED_ORIGINS="

# Function to add values to the setting if they are not already present
add_to_setting() {
    local setting_name=$1
    local setting_value=$2
    local value_to_add=$3

    # Read current value from config file
    current_value=$(grep "^$setting_name" "$paperless_conf" | cut -d '=' -f 2-)

    # Check if value_to_add is already in the list
    if [[ "$current_value" == *"$value_to_add"* ]]; then
        echo "Value $value_to_add is already present in $setting_name in $paperless_conf."
    else
        # Append the value to the list
        new_value="${current_value},${value_to_add}"
        
        # Replace the line in the file with the updated value
        sed -i "s|^$setting_name.*|$setting_name$new_value|g" "$paperless_conf"
        
        echo "Added value $value_to_add to $setting_name in $paperless_conf."
    fi
}

# Add current IP address to PAPERLESS_ALLOWED_HOSTS if not present
add_to_setting "$paperless_allowed_hosts" "$current_ip" "$current_ip"

# Add current FQDN to PAPERLESS_ALLOWED_HOSTS if not present
add_to_setting "$paperless_allowed_hosts" "$current_fqdn" "$current_fqdn"

# Add HTTP and HTTPS prefixes to current IP and FQDN for PAPERLESS_CSRF_TRUSTED_ORIGINS if not present
add_to_setting "$paperless_csrf_trusted_origins" "$current_ip" "http://$current_ip"
add_to_setting "$paperless_csrf_trusted_origins" "$current_ip" "https://$current_ip"
add_to_setting "$paperless_csrf_trusted_origins" "$current_fqdn" "http://$current_fqdn"
add_to_setting "$paperless_csrf_trusted_origins" "$current_fqdn" "https://$current_fqdn"
