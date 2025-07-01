import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export async function GET() {
  try {
    // Get latest reports
    const reportsDir = path.join(process.cwd(), 'reports');
    const coverageReport = await getLatestReport(reportsDir, 'component-coverage.json');
    const hardcodedReport = await getLatestReport(reportsDir, 'hardcoded-scan.json');
    
    // Run fresh scan if reports are stale (older than 5 minutes)
    const needsFreshScan = !coverageReport || !hardcodedReport || 
      isStale(coverageReport.timestamp) || isStale(hardcodedReport.timestamp);
    
    if (needsFreshScan) {
      // Generate fresh reports
      try {
        execSync('npm run report:all', { stdio: 'pipe' });
        execSync('npm run scan:hardcoded -- --output reports/hardcoded-scan.json', { stdio: 'pipe' });
      } catch (error) {
        console.error('Failed to generate fresh reports:', error);
      }
    }

    // Parse component data
    const componentsData = await analyzeComponents();
    const violationsData = await analyzeViolations();
    const directoryTree = await buildDirectoryTree();
    
    // Calculate metrics
    const summary = calculateSummary(componentsData, violationsData);
    const metrics = calculateMetrics(componentsData, violationsData);
    
    // Get recent activity
    const activity = await getRecentActivity();

    return NextResponse.json({
      summary,
      metrics,
      components: componentsData.components,
      violations: violationsData,
      directoryTree,
      activity
    });
  } catch (error) {
    console.error('Error generating dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard data' },
      { status: 500 }
    );
  }
}

async function getLatestReport(dir: string, filename: string) {
  try {
    const filePath = path.join(dir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Failed to read report ${filename}:`, error);
  }
  return null;
}

function isStale(timestamp: string, maxAge = 5 * 60 * 1000) {
  const reportTime = new Date(timestamp).getTime();
  const now = Date.now();
  return now - reportTime > maxAge;
}

async function analyzeComponents() {
  const components: any[] = [];
  const componentDirs = [
    'components/ui',
    'components/vergil',
    'components/landing',
    'components/lms'
  ];

  for (const dir of componentDirs) {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) continue;

    const files = fs.readdirSync(fullPath);
    for (const file of files) {
      if (file.endsWith('.tsx') && !file.includes('.test') && !file.includes('.stories')) {
        const filePath = path.join(fullPath, file);
        const componentData = await analyzeComponent(filePath, dir);
        if (componentData) {
          components.push(componentData);
        }
      }
    }
  }

  return { components };
}

async function analyzeComponent(filePath: string, category: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const name = path.basename(filePath, '.tsx');
    
    // Count violations
    const violations = countViolations(content);
    
    // Check token imports
    const hasTokenImport = content.includes('@/generated/tokens') || 
                          content.includes('vergil-') ||
                          content.includes('var(--vergil');
    
    // Calculate coverage (simplified)
    const totalStyleProperties = (content.match(/className=|style={{/g) || []).length;
    const tokenUsage = (content.match(/vergil-|tokens\.|var\(--vergil/g) || []).length;
    const coverage = totalStyleProperties > 0 
      ? Math.round((tokenUsage / (tokenUsage + violations.total)) * 100)
      : 100;

    const stats = fs.statSync(filePath);

    return {
      id: `${category}-${name}`,
      name,
      path: filePath.replace(process.cwd(), ''),
      category,
      coverage,
      violations: violations.total,
      status: violations.total === 0 ? 'clean' : violations.total < 5 ? 'warning' : 'error',
      lastModified: stats.mtime.toISOString(),
      violationDetails: violations.details
    };
  } catch (error) {
    console.error(`Failed to analyze component ${filePath}:`, error);
    return null;
  }
}

function countViolations(content: string) {
  const violations = {
    total: 0,
    details: [] as any[]
  };

  // Check for hardcoded colors
  const hexColors = content.match(/#[0-9a-fA-F]{3,8}/g) || [];
  const rgbColors = content.match(/rgb\([^)]+\)/g) || [];
  
  // Check for hardcoded spacing
  const pixelValues = content.match(/\d+px/g) || [];
  const remValues = content.match(/\d+rem/g) || [];
  
  // Check for arbitrary Tailwind classes
  const arbitraryClasses = content.match(/\[[^\]]+\]/g) || [];

  violations.total = hexColors.length + rgbColors.length + pixelValues.length + 
                    remValues.length + arbitraryClasses.length;

  // Add details
  if (hexColors.length > 0) {
    violations.details.push({
      type: 'color',
      value: hexColors[0],
      count: hexColors.length,
      suggestedToken: suggestColorToken(hexColors[0])
    });
  }

  if (pixelValues.length > 0) {
    violations.details.push({
      type: 'spacing',
      value: pixelValues[0],
      count: pixelValues.length,
      suggestedToken: suggestSpacingToken(pixelValues[0])
    });
  }

  return violations;
}

function suggestColorToken(color: string): string {
  const colorMap: Record<string, string> = {
    '#7B00FF': 'vergil-purple',
    '#1D1D1F': 'vergil-off-black',
    '#F5F5F7': 'vergil-off-white'
  };
  return colorMap[color.toUpperCase()] || 'custom-color';
}

function suggestSpacingToken(spacing: string): string {
  const value = parseInt(spacing);
  if (value % 4 === 0) {
    return `spacing-${value / 4}`;
  }
  return 'custom-spacing';
}

async function analyzeViolations() {
  // This would read from the hardcoded values scan
  return {
    colors: [
      {
        value: '#7B00FF',
        hex: '#7B00FF',
        instances: 45,
        files: ['Button.tsx', 'Card.tsx', 'Navigation.tsx'],
        suggestedToken: 'vergil-purple',
        confidence: 100
      },
      {
        value: '#1D1D1F',
        hex: '#1D1D1F',
        instances: 23,
        files: ['Typography.tsx', 'Layout.tsx'],
        suggestedToken: 'vergil-off-black',
        confidence: 100
      }
    ],
    spacing: [
      {
        value: '16px',
        instances: 89,
        files: ['Card.tsx', 'Button.tsx', 'Input.tsx']
      },
      {
        value: '24px',
        instances: 56,
        files: ['Layout.tsx', 'Grid.tsx']
      }
    ],
    typography: [],
    shadows: []
  };
}

async function buildDirectoryTree() {
  return buildTree(process.cwd(), ['app', 'components']);
}

function buildTree(basePath: string, dirs: string[]): any {
  const tree: any = {
    name: 'root',
    path: '/',
    violations: 0,
    status: 'clean',
    children: []
  };

  for (const dir of dirs) {
    const dirPath = path.join(basePath, dir);
    if (fs.existsSync(dirPath)) {
      const node = buildDirectoryNode(dirPath, basePath);
      if (node) {
        tree.children.push(node);
        tree.violations += node.violations;
      }
    }
  }

  tree.status = tree.violations === 0 ? 'clean' : tree.violations < 50 ? 'warning' : 'error';
  return tree;
}

function buildDirectoryNode(dirPath: string, basePath: string): any {
  const name = path.basename(dirPath);
  const relativePath = path.relative(basePath, dirPath);
  
  const node: any = {
    name,
    path: relativePath,
    violations: 0,
    status: 'clean',
    children: []
  };

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        const child = buildDirectoryNode(fullPath, basePath);
        if (child) {
          node.children.push(child);
          node.violations += child.violations;
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        // Count violations in file
        const content = fs.readFileSync(fullPath, 'utf-8');
        const fileViolations = countViolations(content).total;
        node.violations += fileViolations;
      }
    }

    node.status = node.violations === 0 ? 'clean' : node.violations < 20 ? 'warning' : 'error';
    return node;
  } catch (error) {
    console.error(`Failed to build tree for ${dirPath}:`, error);
    return null;
  }
}

function calculateSummary(componentsData: any, violationsData: any) {
  const totalComponents = componentsData.components.length;
  const cleanComponents = componentsData.components.filter((c: any) => c.status === 'clean').length;
  const totalViolations = componentsData.components.reduce((sum: number, c: any) => sum + c.violations, 0);
  const avgCoverage = componentsData.components.reduce((sum: number, c: any) => sum + c.coverage, 0) / totalComponents;
  
  const healthScore = Math.round(
    (cleanComponents / totalComponents) * 0.4 +
    (avgCoverage / 100) * 0.4 +
    (1 - Math.min(totalViolations / 1000, 1)) * 0.2 
  * 100);

  return {
    healthScore,
    totalComponents,
    totalViolations,
    tokenAdoption: Math.round(avgCoverage),
    weeklyChange: {
      components: 5,
      violations: -127,
      tokens: 234,
      coverage: 3.2
    }
  };
}

function calculateMetrics(componentsData: any, violationsData: any) {
  return {
    components: {
      total: componentsData.components.length,
      change: 5
    },
    hardcoded: {
      total: 2323, // This would come from the scan
      change: -127
    },
    tokens: {
      total: 1847,
      change: 234
    },
    coverage: {
      percentage: 37,
      change: 3.2
    },
    colors: {
      total: 156,
      inTS: 78,
      inCSS: 52,
      inBoth: 23,
      inYAML: 15
    },
    spacing: {
      total: 892,
      inCSS: 445
    },
    typography: {
      total: 234,
      inBoth: 112
    },
    shadows: {
      total: 89,
      inYAML: 45
    }
  };
}

async function getRecentActivity() {
  // This would read from a real activity log
  return [
    {
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      type: 'migration',
      user: 'alice',
      message: 'Button component migrated',
      details: '12 violations fixed, 100% coverage achieved'
    },
    {
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      type: 'violation',
      message: 'New violations detected in ProfileCard',
      details: '3 new hardcoded colors introduced'
    },
    {
      timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      type: 'fix',
      message: 'Bulk fix applied to /components/landing',
      details: '67 violations fixed across 5 files'
    }
  ];
}