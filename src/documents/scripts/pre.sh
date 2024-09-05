#!/bin/bash

# Define the path to the pre.d directory
PRE_D_DIR="/opt/paperless/src/documents/scripts/pre.d"

# Check if the pre.d directory exists
if [[ ! -d "$PRE_D_DIR" ]]; then
  echo "Directory $PRE_D_DIR does not exist."
  exit 1
fi

# Get the list of .pre.sh files, sort them by filename, and execute each one
for script in $(ls "$PRE_D_DIR"/*.pre.sh | sort); do
  echo "Executing $script"

  # Make sure the script is executable
  chmod +x "$script"
  
  # Run the script
  "$script"

  # Check if the script execution was successful
  if [[ $? -ne 0 ]]; then
    echo "Error: Script $script failed to execute."
    exit 1
  fi
done

echo "All pre-consumption scripts executed successfully."
