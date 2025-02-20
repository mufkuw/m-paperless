#!/bin/bash

# Get the current IP address of the system
current_ip=$(hostname -I | awk '{print $1}')

# Get the Fully Qualified Domain Name (FQDN) of the system
current_fqdn=$(hostname -f)

# Get the short hostname (without the domain part)
current_hostname=$(hostname)

# Print out the hostname to debug
echo "Current Hostname: $current_hostname"

# Define the configuration file path for both settings
paperless_conf="/opt/paperless/paperless.conf"

# Define the settings to modify
paperless_allowed_hosts="PAPERLESS_ALLOWED_HOSTS="
paperless_csrf_trusted_origins="PAPERLESS_CSRF_TRUSTED_ORIGINS="

# Function to add values to the setting if they are not already present
add_to_setting() {
    local setting_name=$1
    local value_to_add=$2

    # Read current value from config file
    current_value=$(grep "^$setting_name" "$paperless_conf" | cut -d '=' -f 2-)

    # Remove leading/trailing spaces or commas
    current_value=$(echo "$current_value" | sed 's/^[, ]*//;s/[ ,]*$//')

    # If the setting is empty, initialize it with the first value
    if [[ -z "$current_value" ]]; then
        new_value="$value_to_add"
    else
        # Check if value_to_add is already in the list
        if [[ "$current_value" == *"$value_to_add"* ]]; then
            echo "Value $value_to_add is already present in $setting_name in $paperless_conf."
            return
        fi
        # Append the value to the list
        new_value="${current_value},${value_to_add}"
    fi

    # Replace the line in the file with the updated value
    sed -i "s|^$setting_name.*|$setting_name$new_value|g" "$paperless_conf"
    
    echo "Added value $value_to_add to $setting_name in $paperless_conf."
}

# Add current IP address to PAPERLESS_ALLOWED_HOSTS if not present
add_to_setting "$paperless_allowed_hosts" "$current_ip"

# Add current hostname to PAPERLESS_ALLOWED_HOSTS if not present
add_to_setting "$paperless_allowed_hosts" "$current_hostname"

# Add current FQDN to PAPERLESS_ALLOWED_HOSTS if not present
add_to_setting "$paperless_allowed_hosts" "$current_fqdn"


# Add HTTP and HTTPS prefixes to current IP, FQDN, and hostname for PAPERLESS_CSRF_TRUSTED_ORIGINS if not present
echo "Adding hostname to PAPERLESS_CSRF_TRUSTED_ORIGINS: http://$current_hostname"  # Debugging output
add_to_setting "$paperless_csrf_trusted_origins" "http://$current_hostname"
add_to_setting "$paperless_csrf_trusted_origins" "https://$current_hostname"

# Add HTTP and HTTPS prefixes to current IP and FQDN for PAPERLESS_CSRF_TRUSTED_ORIGINS if not present
add_to_setting "$paperless_csrf_trusted_origins" "http://$current_ip"
add_to_setting "$paperless_csrf_trusted_origins" "https://$current_ip"
add_to_setting "$paperless_csrf_trusted_origins" "http://$current_fqdn"
add_to_setting "$paperless_csrf_trusted_origins" "https://$current_fqdn"
