#!/bin/bash
# Script to update all tool pages with consistent styling and structure

echo "Starting update process for all tool pages..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Path to the JavaScript file
SCRIPT_PATH="$(dirname "$0")/update-all-tools.js"

# Check if the script exists
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "Error: Script not found at $SCRIPT_PATH"
    exit 1
fi

# Run the JavaScript script
node "$SCRIPT_PATH"

echo "Script execution completed." 