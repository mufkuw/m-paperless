#!/bin/bash

# Hardcoded path to the Python script
PYTHON_SCRIPT="/opt/paperless/src/documents/scripts/post.d/sync_to_sharepoint/sync_to_share_point.py"

# Check if DOCUMENT_ARCHIVE_PATH is set
if [ -z "$DOCUMENT_ARCHIVE_PATH" ]; then
    echo "DOCUMENT_ARCHIVE_PATH environment variable is not set."
    exit 1
fi

# Check if the Python script exists
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo "Python script not found: $PYTHON_SCRIPT"
    exit 1
fi

# Check if DOCUMENT_ARCHIVE_PATH is a file or directory
if [ -f "$DOCUMENT_ARCHIVE_PATH" ]; then
    # If DOCUMENT_ARCHIVE_PATH is a file, process that file
    if [[ "$DOCUMENT_ARCHIVE_PATH" == *.pdf ]]; then
        echo "Processing file: $DOCUMENT_ARCHIVE_PATH"
        python "$PYTHON_SCRIPT" "$DOCUMENT_ARCHIVE_PATH"
    else
        echo "The specified file is not a PDF: $DOCUMENT_ARCHIVE_PATH"
        exit 1
    fi
elif [ -d "$DOCUMENT_ARCHIVE_PATH" ]; then
    # If DOCUMENT_ARCHIVE_PATH is a directory, process all PDF files in the directory
    pdf_files=("$DOCUMENT_ARCHIVE_PATH"/*.pdf)

    # Check if there are no PDF files
    if [ "${#pdf_files[@]}" -eq 0 ]; then
        echo "No PDF files found in $DOCUMENT_ARCHIVE_PATH"
        exit 1
    fi

    # Process each PDF file
    for pdf_file in "${pdf_files[@]}"; do
        echo "Processing file: $pdf_file"
        python "$PYTHON_SCRIPT" "$pdf_file"
    done
else
    echo "DOCUMENT_ARCHIVE_PATH is not a valid file or directory: $DOCUMENT_ARCHIVE_PATH"
    exit 1
fi


# Check if the Python script exists
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo "Python script not found: $PYTHON_SCRIPT"
    exit 0
fi

echo "$DOCUMENT_ARCHIVE_PATH"

# Check if DOCUMENT_ARCHIVE_PATH is set and is a directory
if [ ! -d "$DOCUMENT_ARCHIVE_PATH" ]; then
    echo "DOCUMENT_ARCHIVE_PATH is not set or is not a valid directory."
    exit 0
fi

# Find all PDF files in the document archive directory
pdf_files=("$DOCUMENT_ARCHIVE_PATH"/*.pdf)

# Check if there are no PDF files
if [ "${#pdf_files[@]}" -eq 0 ]; then
    echo "No PDF files found in $DOCUMENT_ARCHIVE_PATH"
    exit 0
fi

# Process each PDF file
for pdf_file in "${pdf_files[@]}"; do
    echo "Processing file: $pdf_file"
    python "$PYTHON_SCRIPT" "$pdf_file"
done
