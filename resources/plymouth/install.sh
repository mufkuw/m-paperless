#!/bin/bash

apt install plymouth plymouth-themes -y
cp --recursive /opt/paperless/resources/plymouth/m-paperless /usr/share/plymouth/themes/
plymouth-set-default-theme -R m-paperless


# Define constant for the GRUB configuration file path
GRUB_CONFIG_FILE="/etc/default/grub"

# Define the options to add
options_to_add="quiet splash loglevel=4"

# Check if each option is already present in GRUB_CMDLINE_LINUX_DEFAULT
for option in $options_to_add; do
    if ! grep -q "\\b$option\\b" "$GRUB_CONFIG_FILE"; then
        # Option not found, add it to GRUB_CMDLINE_LINUX_DEFAULT
        sudo sed -i "s/\(GRUB_CMDLINE_LINUX_DEFAULT=\"[^\"]*\)\"/\1 $option\"/" "$GRUB_CONFIG_FILE"
    fi
done

# Update GRUB to apply the changes
sudo update-grub2