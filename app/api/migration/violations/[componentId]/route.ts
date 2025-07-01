import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { componentId: string } }
) {
  try {
    const componentId = params.componentId;
    
    // Parse component ID to get path
    const [category, name] = componentId.split('-');
    const componentPath = path.join(process.cwd(), 'components', category, `${name}.tsx`);
    
    if (!fs.existsSync(componentPath)) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(componentPath, 'utf-8');
    const violations = analyzeDetailedViolations(content);

    return NextResponse.json({
      componentId,
      path: componentPath.replace(process.cwd(), ''),
      violations
    });
  } catch (error) {
    console.error('Error analyzing component violations:', error);
    return NextResponse.json(
      { error: 'Failed to analyze component' },
      { status: 500 }
    );
  }
}

function analyzeDetailedViolations(content: string) {
  const violations: any[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for hex colors
    const hexMatches = line.matchAll(/#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?/g);
    for (const match of hexMatches) {
      violations.push({
        type: 'color',
        value: match[0],
        line: lineNumber,
        column: match.index || 0,
        context: line.trim(),
        suggestedToken: suggestColorToken(match[0]),
        confidence: 95
      });
    }

    // Check for pixel values
    const pixelMatches = line.matchAll(/(\d+)px/g);
    for (const match of pixelMatches) {
      violations.push({
        type: 'spacing',
        value: match[0],
        line: lineNumber,
        column: match.index || 0,
        context: line.trim(),
        suggestedToken: suggestSpacingToken(match[0]),
        confidence: 85
      });
    }

    // Check for arbitrary Tailwind classes
    const arbitraryMatches = line.matchAll(/(?:bg|text|border)-\[([^\]]+)\]/g);
    for (const match of arbitraryMatches) {
      violations.push({
        type: 'arbitrary-tailwind',
        value: match[0],
        line: lineNumber,
        column: match.index || 0,
        context: line.trim(),
        suggestedToken: suggestTailwindToken(match[0]),
        confidence: 90
      });
    }
  });

  return violations;
}

function suggestColorToken(color: string): string {
  const colorMap: Record<string, string> = {
    '#7B00FF': 'vergil-purple',
    '#1D1D1F': 'vergil-off-black',
    '#F5F5F7': 'vergil-off-white',
    '#6366F1': 'cosmic-purple',
    '#3B82F6': 'neural-blue'
  };
  return colorMap[color.toUpperCase()] || 'colors.custom';
}

function suggestSpacingToken(spacing: string): string {
  const value = parseInt(spacing);
  const spacingMap: Record<number, string> = {
    4: 'spacing-1',
    8: 'spacing-2',
    12: 'spacing-3',
    16: 'spacing-4',
    20: 'spacing-5',
    24: 'spacing-6',
    32: 'spacing-8',
    40: 'spacing-10',
    48: 'spacing-12',
    64: 'spacing-16'
  };
  return spacingMap[value] || `spacing-[${value}px]`;
}

function suggestTailwindToken(className: string): string {
  if (className.includes('bg-[#')) {
    const color = className.match(/#[0-9a-fA-F]+/)?.[0];
    if (color) {
      const token = suggestColorToken(color);
      return `bg-${token}`;
    }
  }
  return className.replace(/\[[^\]]+\]/, 'token');
}