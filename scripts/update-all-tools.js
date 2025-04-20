/**
 * Update All Tools Script
 * 
 * This script runs both unify-icons.js and update-tool-pages.js
 * to ensure all tool pages have consistent styling and structure.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log("=== Starting All Tool Pages Update Process ===");

// Path to scripts
const scriptsDir = __dirname;
const unifyIconsScript = path.join(scriptsDir, 'unify-icons.js');
const updateToolPagesScript = path.join(scriptsDir, 'update-tool-pages.js');

// Verify scripts exist
if (!fs.existsSync(unifyIconsScript)) {
  console.error(`Error: unify-icons.js not found at ${unifyIconsScript}`);
  process.exit(1);
}

if (!fs.existsSync(updateToolPagesScript)) {
  console.error(`Error: update-tool-pages.js not found at ${updateToolPagesScript}`);
  process.exit(1);
}

// Function to run a script and return a promise
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning ${path.basename(scriptPath)}...`);
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running ${scriptPath}: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Script ${scriptPath} stderr: ${stderr}`);
      }
      console.log(stdout);
      resolve();
    });
  });
}

// Run the scripts in sequence
async function updateAllTools() {
  try {
    // First, update tool pages based on template
    await runScript(updateToolPagesScript);
    
    // Then, unify all icons to match DALL-E 3 style
    await runScript(unifyIconsScript);
    
    console.log("\n=== All Tool Updates Complete ===");
    console.log("All tool pages now have consistent structure and styling.");
    console.log("Tool icons now match the DALL-E 3 style.");
  } catch (error) {
    console.error("An error occurred during the update process:", error);
    process.exit(1);
  }
}

// Start the update process
updateAllTools(); 