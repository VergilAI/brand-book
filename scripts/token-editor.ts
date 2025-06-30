#!/usr/bin/env node

/**
 * Token Editor - Main CLI entry point
 */

import { TokenEditor } from './token-manager/cli.js';

// Start the interactive token editor
const editor = new TokenEditor();
editor.start().catch((error) => {
  console.error('Failed to start token editor:', error);
  process.exit(1);
});