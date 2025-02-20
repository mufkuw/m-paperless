#!/bin/bash

# Define the Ghostscript version and URL
GS_VERSION="10.04.0"
GS_URL="https://github.com/ArtifexSoftware/ghostpdl-downloads/releases/download/gs10040/ghostscript-10.04.0.tar.gz"

# Step 1: Remove the existing version of Ghostscript
echo "Removing existing Ghostscript..."
sudo apt-get remove --purge -y ghostscript

# Step 2: Install necessary build dependencies
echo "Installing build dependencies..."
sudo apt-get update
sudo apt-get install -y build-essential libpng-dev libjpeg-dev libtiff-dev zlib1g-dev

# Step 3: Download the specified version of Ghostscript
echo "Downloading Ghostscript $GS_VERSION..."
wget $GS_URL -O ghostscript-$GS_VERSION.tar.gz

# Step 4: Extract the tarball
echo "Extracting Ghostscript $GS_VERSION..."
tar -xvf ghostscript-$GS_VERSION.tar.gz

# Step 5: Compile and install Ghostscript
cd ghostscript-$GS_VERSION
echo "Configuring Ghostscript $GS_VERSION..."
./configure

echo "Building Ghostscript $GS_VERSION..."
make

echo "Installing Ghostscript $GS_VERSION..."
sudo make install

# Step 6: Verify the installation
echo "Verifying Ghostscript installation..."
gs --version

if [ $? -eq 0 ]; then
    echo "Ghostscript $GS_VERSION has been successfully installed."
else
    echo "There was an error installing Ghostscript $GS_VERSION."
fi

# Clean up downloaded files
cd ..
rm -rf ghostscript-$GS_VERSION ghostscript-$GS_VERSION.tar.gz

echo "Upgrade script completed."
