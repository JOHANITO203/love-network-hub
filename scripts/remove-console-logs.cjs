#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to remove console.log and console.debug from source files
 * Keeps console.error and console.warn for production debugging
 */

const srcDir = path.join(__dirname, '../src');
let filesProcessed = 0;
let logsRemoved = 0;

// Patterns to remove (console.log and console.debug)
const patterns = [
  /console\.log\([^)]*\);?\n?/g,
  /console\.debug\([^)]*\);?\n?/g,
];

// Multiline console.log patterns
const multilinePattern = /console\.(log|debug)\([^;]*?\);?\n?/gs;

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let removedInFile = 0;

  // Remove single-line console.log/debug
  patterns.forEach(pattern => {
    const matches = newContent.match(pattern);
    if (matches) {
      removedInFile += matches.length;
      newContent = newContent.replace(pattern, '');
    }
  });

  // Remove multiline console.log/debug
  const multilineMatches = newContent.match(multilinePattern);
  if (multilineMatches) {
    removedInFile += multilineMatches.length;
    newContent = newContent.replace(multilinePattern, '');
  }

  // Clean up multiple empty lines (max 2 consecutive)
  newContent = newContent.replace(/\n{3,}/g, '\n\n');

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ ${path.relative(srcDir, filePath)}: ${removedInFile} logs removed`);
    logsRemoved += removedInFile;
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

console.log('🧹 Removing console.log and console.debug from source files...\n');
walkDir(srcDir);
console.log(`\n✅ Done! Processed ${filesProcessed} files, removed ${logsRemoved} console statements.`);
console.log('ℹ️  console.error and console.warn were kept for production debugging.');
