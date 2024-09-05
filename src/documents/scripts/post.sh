#!/bin/bash

# Define the path to the post.d directory
POST_D_DIR="/opt/paperless/src/documents/scripts/post.d"

# Check if the post.d directory exists
if [[ ! -d "$POST_D_DIR" ]]; then
  echo "Directory $POST_D_DIR does not exist."
  exit 1
fi

# Get the list of .post.sh files, sort them by filename, and execute each one
for script in $(ls "$POST_D_DIR"/*.post.sh | sort); do
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

echo "All post-consumption scripts executed successfully."
