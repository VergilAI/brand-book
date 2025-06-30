import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * Test script to verify safe extraction works without breaking the UI
 */

async function testSafeExtraction() {
  console.log('🧪 Testing Safe Extraction System\n');

  // Create a test file with hardcoded values
  const testDir = path.join(process.cwd(), 'test-migration');
  const testFile = path.join(testDir, 'test-component.tsx');
  
  // Create test directory
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Create test component with various hardcoded values
  const testContent = `import React from 'react';

export const TestComponent = () => {
  return (
    <div className="p-[24px] bg-[#7B00FF] rounded-[8px]" style={{ color: '#F5F5F7' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
        Test Component
      </h1>
      <p className="text-[#1D1D1F]" style={{ lineHeight: '1.5', letterSpacing: '0.5px' }}>
        This component has various hardcoded values for testing.
      </p>
      <button 
        className="bg-[#6366F1] hover:bg-[#4F46E5] px-[16px] py-[8px] rounded-[4px]"
        style={{ 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          transition: 'all 0.3s ease',
          border: '1px solid #E5E7EB'
        }}
      >
        Click Me
      </button>
    </div>
  );
};

// CSS Module example
const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#FAFAFA',
    borderRadius: '12px',
  },
  title: {
    fontSize: '32px',
    color: '#111827',
    fontWeight: 700,
  }
};
`;

  await fs.promises.writeFile(testFile, testContent);
  console.log('✅ Created test file with hardcoded values\n');

  // Check if migration-tokens.css exists from previous runs
  const migrationCssPath = path.join(process.cwd(), 'styles', 'migration-tokens.css');
  if (fs.existsSync(migrationCssPath)) {
    console.log('⚠️  Found existing migration-tokens.css, removing...');
    fs.unlinkSync(migrationCssPath);
  }

  // Check globals.css for previous imports
  const globalsCssPath = path.join(process.cwd(), 'app', 'globals.css');
  if (fs.existsSync(globalsCssPath)) {
    let globalsCss = await fs.promises.readFile(globalsCssPath, 'utf-8');
    if (globalsCss.includes('migration-tokens.css')) {
      console.log('⚠️  Found existing migration import in globals.css, cleaning up...');
      globalsCss = globalsCss.replace(/\n*\/\* Temporary migration tokens \*\/\n@import "\.\.\/styles\/migration-tokens\.css";\n*/g, '');
      await fs.promises.writeFile(globalsCssPath, globalsCss);
    }
  }

  console.log('🔄 Running safe extraction on test file...\n');

  // Import and run the safe extractor
  const { SafeMigrationExtractor } = await import('./migration-extract-safe');
  const extractor = new SafeMigrationExtractor();
  
  try {
    // Run extraction
    await extractor.extract();

    console.log('\n✅ Safe extraction completed successfully!');
    console.log('\n📋 Verification checklist:');
    
    // Verify migration CSS was created
    if (fs.existsSync(migrationCssPath)) {
      const cssContent = await fs.promises.readFile(migrationCssPath, 'utf-8');
      const tokenCount = (cssContent.match(/--temp-/g) || []).length;
      console.log(`   ✅ migration-tokens.css created with ${tokenCount} tokens`);
    } else {
      console.log('   ❌ migration-tokens.css NOT created');
    }

    // Verify globals.css was updated
    const updatedGlobalsCss = await fs.promises.readFile(globalsCssPath, 'utf-8');
    if (updatedGlobalsCss.includes('migration-tokens.css')) {
      console.log('   ✅ globals.css imports migration tokens');
    } else {
      console.log('   ❌ globals.css NOT updated');
    }

    // Verify test file was modified
    const modifiedTestContent = await fs.promises.readFile(testFile, 'utf-8');
    const varCount = (modifiedTestContent.match(/var\(--temp-/g) || []).length;
    console.log(`   ✅ Test file updated with ${varCount} CSS variables`);

    // Show sample of changes
    console.log('\n📝 Sample changes:');
    console.log('   Before: bg-[#7B00FF]');
    console.log('   After:  bg-[var(--temp-color-1)]');
    console.log('\n   Before: padding: \'32px\'');
    console.log('   After:  padding: \'var(--temp-spacing-1)\'');

    // Check report generation
    const reportPath = path.join(process.cwd(), 'reports', 'migration-discovery.json');
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(await fs.promises.readFile(reportPath, 'utf-8'));
      console.log(`\n📊 Report generated with ${report.totalFindings} findings`);
    }

  } catch (error) {
    console.error('\n❌ Safe extraction failed:', error);
  }

  // Cleanup test directory
  console.log('\n🧹 Cleaning up test files...');
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }

  console.log('\n✨ Test complete!');
}

// Run the test
testSafeExtraction().catch(console.error);