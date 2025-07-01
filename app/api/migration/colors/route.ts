import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export async function GET() {
  try {
    // Load current tokens
    const tokensPath = path.join(process.cwd(), 'design-tokens', 'active', 'source', 'colors.yaml');
    const tokenContent = fs.readFileSync(tokensPath, 'utf-8');
    const tokenData = yaml.load(tokenContent) as any;
    
    // Analyze codebase for color usage
    const colorUsage = await analyzeColorUsage();
    
    // Map colors to tokens
    const colorMappings = generateColorMappings(colorUsage, tokenData);
    
    return NextResponse.json({
      colors: colorMappings,
      summary: {
        totalColors: colorMappings.length,
        mapped: colorMappings.filter(c => c.suggestedToken).length,
        unmapped: colorMappings.filter(c => !c.suggestedToken).length
      }
    });
  } catch (error) {
    console.error('Error analyzing colors:', error);
    return NextResponse.json(
      { error: 'Failed to analyze colors' },
      { status: 500 }
    );
  }
}

async function analyzeColorUsage() {
  const colorMap = new Map<string, { files: Set<string>, count: number }>();
  const directories = ['app', 'components'];
  
  for (const dir of directories) {
    await scanDirectory(path.join(process.cwd(), dir), colorMap);
  }
  
  // Convert to array format
  return Array.from(colorMap.entries()).map(([color, data]) => ({
    value: color,
    instances: data.count,
    files: Array.from(data.files)
  }));
}

async function scanDirectory(dir: string, colorMap: Map<string, any>) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      await scanDirectory(fullPath, colorMap);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.css'))) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Find hex colors
      const hexMatches = content.matchAll(/#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?/g);
      for (const match of hexMatches) {
        const color = match[0].toUpperCase();
        if (!colorMap.has(color)) {
          colorMap.set(color, { files: new Set(), count: 0 });
        }
        const data = colorMap.get(color)!;
        data.files.add(path.relative(process.cwd(), fullPath));
        data.count++;
      }
      
      // Find RGB colors
      const rgbMatches = content.matchAll(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g);
      for (const match of rgbMatches) {
        const color = match[0];
        if (!colorMap.has(color)) {
          colorMap.set(color, { files: new Set(), count: 0 });
        }
        const data = colorMap.get(color)!;
        data.files.add(path.relative(process.cwd(), fullPath));
        data.count++;
      }
    }
  }
}

function generateColorMappings(colorUsage: any[], tokenData: any) {
  const tokenColors = extractTokenColors(tokenData.colors);
  
  return colorUsage.map(color => {
    const mapping = findBestTokenMatch(color.value, tokenColors);
    
    return {
      value: color.value,
      hex: color.value,
      instances: color.instances,
      files: color.files.slice(0, 5), // Limit to first 5 files
      suggestedToken: mapping?.token,
      confidence: mapping?.confidence || 0,
      category: mapping?.category || 'unknown'
    };
  }).sort((a, b) => b.instances - a.instances);
}

function extractTokenColors(colors: any, prefix = ''): any[] {
  const result: any[] = [];
  
  for (const [key, value] of Object.entries(colors)) {
    const tokenPath = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && 'value' in value) {
      result.push({
        token: tokenPath.replace(/\./g, '-'),
        value: value.value,
        category: prefix.split('.')[0] || 'brand'
      });
    } else if (value && typeof value === 'object') {
      result.push(...extractTokenColors(value, tokenPath));
    }
  }
  
  return result;
}

function findBestTokenMatch(color: string, tokenColors: any[]) {
  // Direct match
  const directMatch = tokenColors.find(t => 
    t.value.toUpperCase() === color.toUpperCase()
  );
  
  if (directMatch) {
    return {
      token: directMatch.token,
      confidence: 100,
      category: directMatch.category
    };
  }
  
  // Try to convert RGB to hex and match
  if (color.startsWith('rgb')) {
    const hex = rgbToHex(color);
    const rgbMatch = tokenColors.find(t => 
      t.value.toUpperCase() === hex.toUpperCase()
    );
    
    if (rgbMatch) {
      return {
        token: rgbMatch.token,
        confidence: 95,
        category: rgbMatch.category
      };
    }
  }
  
  // No match found
  return null;
}

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return rgb;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}