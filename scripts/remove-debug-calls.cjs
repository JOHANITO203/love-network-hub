#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Remove window.addDebugLog calls from source files
 */

const srcDir = path.join(__dirname, '../src');
let filesProcessed = 0;
let callsRemoved = 0;

// Pattern for window.addDebugLog calls (single and multi-line)
const patterns = [
  /\s*window\.addDebugLog\?\.\([^)]*\);?\n?/g,
  /\s*window\.addDebugLog\?\.\(\s*[\s\S]*?\);?\n?/g,
];

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let removedInFile = 0;

  // Remove all window.addDebugLog patterns
  patterns.forEach(pattern => {
    const matches = newContent.match(pattern);
    if (matches) {
      removedInFile += matches.length;
      newContent = newContent.replace(pattern, '');
    }
  });

  // Clean up multiple empty lines
  newContent = newContent.replace(/\n{3,}/g, '\n\n');

  // Clean up trailing whitespace
  newContent = newContent.replace(/ +$/gm, '');

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ ${path.relative(srcDir, filePath)}: ${removedInFile} debug calls removed`);
    callsRemoved += removedInFile;
    filesProcessed++;
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (
      stat.isFile() &&
      (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))
    ) {
      processFile(filePath);
    }
  });
}

console.log('🧹 Removing window.addDebugLog calls from source files...\n');
walkDir(srcDir);
console.log(`\n✅ Done! Processed ${filesProcessed} files, removed ${callsRemoved} debug calls.`);
