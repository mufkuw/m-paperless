#!/bin/bash

# Function to check if the path fits the required pattern
validate_path() {
  local path="$1"
  # Use a pattern to match any number of directories before /Signed/ and any file extension after
  if [[ "$path" =~ .*/[^/]+/Signed/[^/]+\.[^/]+$ ]]; then
    return 0
  else
    return 1
  fi
}

# Check if the necessary environment variables are set
if [[ -z "$DOCUMENT_SOURCE_PATH" || -z "$DOCUMENT_WORKING_PATH" ]]; then
  echo "Warning: Required environment variables are not set."
  echo "Ensure DOCUMENT_SOURCE_PATH and DOCUMENT_WORKING_PATH are set."
  exit 0
fi

# Validate the DOCUMENT_SOURCE_PATH
if ! validate_path "$DOCUMENT_SOURCE_PATH"; then
  echo "Warning: DOCUMENT_SOURCE_PATH '$DOCUMENT_SOURCE_PATH' does not fit the expected pattern. Skipping document signing."
  exit 0
fi

# Extract the PersonName from the DOCUMENT_SOURCE_PATH
# This assumes PersonName is always the directory immediately before /Signed
PERSON_NAME=$(basename "$(dirname "$(dirname "$DOCUMENT_SOURCE_PATH")")")

# Check if PERSON_NAME is "Signed"
if [[ "$PERSON_NAME" == "Signed" ]]; then
  echo "Warning: PERSON_NAME extracted as 'Signed'. Skipping document signing."
  exit 0
fi

# Define the path to the signatures directory
SIGNATURES_DIR="/opt/paperless/resources/signatures"

# Construct the path to the signature PNG file
SIGNATURE_PNG="$SIGNATURES_DIR/${PERSON_NAME}.png"

# Define the path to the Python script
PYTHON_SCRIPT="/opt/paperless/src/documents/scripts/pre.d/signature_impose/signagure_impose.py"

# Check if the input file exists
if [[ ! -f "$DOCUMENT_SOURCE_PATH" ]]; then
  echo "Warning: Input file '$DOCUMENT_SOURCE_PATH' does not exist. Skipping signature application."
  exit 0
fi

# Check if the signature PNG file exists
if [[ ! -f "$SIGNATURE_PNG" ]]; then
  echo "Warning: Signature PNG '$SIGNATURE_PNG' does not exist. Skipping signature application."
  exit 0
fi

# Check if the Python script exists
if [[ ! -f "$PYTHON_SCRIPT" ]]; then
  echo "Warning: Python script '$PYTHON_SCRIPT' does not exist. Skipping signature application."
  exit 0
fi

# Run the Python script with the constructed signature PNG path
python "$PYTHON_SCRIPT" "$DOCUMENT_SOURCE_PATH" "$SIGNATURE_PNG" "$DOCUMENT_WORKING_PATH"

# Check if the Python script execution was successful
if [[ $? -ne 0 ]]; then
  echo "Warning: Python script '$PYTHON_SCRIPT' failed."
  exit 0
fi

echo "Signature applied successfully. Output file: $DOCUMENT_WORKING_PATH"
