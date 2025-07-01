import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface SyncStatus {
  isInSync: boolean;
  yamlLastModified: string;
  generatedLastModified: string;
  needsRegeneration: boolean;
  details: {
    yamlFiles: string[];
    generatedFiles: string[];
    missingGenerated: string[];
    message: string;
  };
}

function getFileHash(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return crypto.createHash('md5').update(content).digest('hex');
  } catch {
    return '';
  }
}

function getLatestModifiedTime(directory: string, pattern?: RegExp): Date {
  let latestTime = new Date(0);
  
  try {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      if (pattern && !pattern.test(file)) continue;
      
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile() && stats.mtime > latestTime) {
        latestTime = stats.mtime;
      } else if (stats.isDirectory() && !file.startsWith('.')) {
        // Recursively check subdirectories
        const subDirTime = getLatestModifiedTime(filePath, pattern);
        if (subDirTime > latestTime) {
          latestTime = subDirTime;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
  }
  
  return latestTime;
}

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const yamlSourceDir = path.join(projectRoot, 'design-tokens', 'active', 'source');
    const generatedDir = path.join(projectRoot, 'generated');
    
    // Check if directories exist
    if (!fs.existsSync(yamlSourceDir)) {
      return NextResponse.json({
        isInSync: false,
        yamlLastModified: new Date(0).toISOString(),
        generatedLastModified: new Date(0).toISOString(),
        needsRegeneration: true,
        details: {
          yamlFiles: [],
          generatedFiles: [],
          missingGenerated: ['all'],
          message: 'YAML source directory not found'
        }
      });
    }
    
    // Get latest modification times
    const yamlLastModified = getLatestModifiedTime(yamlSourceDir, /\.ya?ml$/);
    const generatedLastModified = getLatestModifiedTime(generatedDir);
    
    // Check for expected generated files
    const expectedGeneratedFiles = [
      'tokens.ts',
      'tokens.css',
      'tokens.json',
      'tailwind-theme.js'
    ];
    
    const existingGeneratedFiles: string[] = [];
    const missingGeneratedFiles: string[] = [];
    
    for (const file of expectedGeneratedFiles) {
      const filePath = path.join(generatedDir, file);
      if (fs.existsSync(filePath)) {
        existingGeneratedFiles.push(file);
      } else {
        missingGeneratedFiles.push(file);
      }
    }
    
    // Get list of YAML files
    const yamlFiles: string[] = [];
    function collectYamlFiles(dir: string, baseDir: string = '') {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const relativePath = path.join(baseDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile() && /\.ya?ml$/.test(file)) {
          yamlFiles.push(relativePath);
        } else if (stats.isDirectory() && !file.startsWith('.')) {
          collectYamlFiles(filePath, relativePath);
        }
      }
    }
    collectYamlFiles(yamlSourceDir);
    
    // Determine sync status
    const isInSync = missingGeneratedFiles.length === 0 && 
                     yamlLastModified <= generatedLastModified;
    const needsRegeneration = !isInSync;
    
    let message = '';
    if (missingGeneratedFiles.length > 0) {
      message = `Missing generated files: ${missingGeneratedFiles.join(', ')}`;
    } else if (yamlLastModified > generatedLastModified) {
      message = 'YAML files have been modified after token generation';
    } else {
      message = 'All files are in sync';
    }
    
    const status: SyncStatus = {
      isInSync,
      yamlLastModified: yamlLastModified.toISOString(),
      generatedLastModified: generatedLastModified.toISOString(),
      needsRegeneration,
      details: {
        yamlFiles,
        generatedFiles: existingGeneratedFiles,
        missingGenerated: missingGeneratedFiles,
        message
      }
    };
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking sync status:', error);
    return NextResponse.json({
      isInSync: false,
      yamlLastModified: new Date(0).toISOString(),
      generatedLastModified: new Date(0).toISOString(),
      needsRegeneration: true,
      details: {
        yamlFiles: [],
        generatedFiles: [],
        missingGenerated: [],
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }, { status: 500 });
  }
}