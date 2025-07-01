import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { componentId, violations, dryRun = true } = body;

    // Parse component path
    const [category, name] = componentId.split('-');
    const componentPath = path.join(process.cwd(), 'components', category, `${name}.tsx`);
    
    if (!fs.existsSync(componentPath)) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    // Read component content
    let content = fs.readFileSync(componentPath, 'utf-8');
    const originalContent = content;
    
    // Apply fixes
    const fixes: any[] = [];
    for (const violation of violations) {
      const fix = applyFix(content, violation);
      if (fix) {
        content = fix.content;
        fixes.push(fix.change);
      }
    }

    // Generate diff
    const diff = generateDiff(originalContent, content);

    if (!dryRun) {
      // Write the fixed content
      fs.writeFileSync(componentPath, content);
      
      // Log the change
      logMigration(componentId, fixes.length);
    }

    return NextResponse.json({
      componentId,
      fixesApplied: fixes.length,
      diff,
      dryRun,
      changes: fixes
    });
  } catch (error) {
    console.error('Error applying fixes:', error);
    return NextResponse.json(
      { error: 'Failed to apply fixes' },
      { status: 500 }
    );
  }
}

function applyFix(content: string, violation: any) {
  const { type, value, suggestedToken, line } = violation;
  
  // Get the line content
  const lines = content.split('\n');
  if (line > lines.length) return null;
  
  const lineContent = lines[line - 1];
  let newLineContent = lineContent;
  
  switch (type) {
    case 'color':
      // Replace hex color with token
      if (value.startsWith('#')) {
        newLineContent = lineContent.replace(
          new RegExp(`(['"\`]?)${value}(['"\`]?)`, 'g'),
          `$1var(--vergil-${suggestedToken})$2`
        );
        
        // Also handle Tailwind arbitrary values
        newLineContent = newLineContent.replace(
          new RegExp(`\\[${value}\\]`, 'g'),
          suggestedToken
        );
      }
      break;
      
    case 'spacing':
      // Replace pixel values with spacing tokens
      const pixelValue = parseInt(value);
      if (pixelValue % 4 === 0) {
        const spacingClass = `spacing-${pixelValue / 4}`;
        newLineContent = lineContent.replace(
          new RegExp(`(['"\`]?)${value}(['"\`]?)`, 'g'),
          `$1var(--vergil-${spacingClass})$2`
        );
        
        // Handle Tailwind classes
        newLineContent = newLineContent.replace(
          new RegExp(`\\[${value}\\]`, 'g'),
          spacingClass.replace('spacing-', '')
        );
      }
      break;
      
    case 'arbitrary-tailwind':
      // Replace arbitrary Tailwind classes
      newLineContent = lineContent.replace(value, suggestedToken);
      break;
  }
  
  if (newLineContent !== lineContent) {
    lines[line - 1] = newLineContent;
    return {
      content: lines.join('\n'),
      change: {
        line,
        type,
        from: value,
        to: suggestedToken,
        before: lineContent.trim(),
        after: newLineContent.trim()
      }
    };
  }
  
  return null;
}

function generateDiff(original: string, modified: string) {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');
  const diff: any[] = [];
  
  for (let i = 0; i < Math.max(originalLines.length, modifiedLines.length); i++) {
    if (originalLines[i] !== modifiedLines[i]) {
      diff.push({
        line: i + 1,
        removed: originalLines[i],
        added: modifiedLines[i]
      });
    }
  }
  
  return diff;
}

function logMigration(componentId: string, fixCount: number) {
  // In a real implementation, this would write to a log file or database
  const logEntry = {
    timestamp: new Date().toISOString(),
    componentId,
    fixCount,
    type: 'automated-fix'
  };
  
  console.log('Migration logged:', logEntry);
}