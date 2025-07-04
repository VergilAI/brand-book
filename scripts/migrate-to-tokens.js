#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Color mappings from hex values to semantic tokens
const colorMappings = {
  // Brand colors
  '#7B00FF': 'vergil-purple',
  '#6366F1': 'cosmic-purple',
  '#8B5CF6': 'electric-violet',
  '#A78BFA': 'electric-violet',
  '#818CF8': 'luminous-indigo',
  
  // Status colors
  '#10B981': 'success',
  '#F59E0B': 'warning',
  '#F97316': 'warning',
  '#EF4444': 'error',
  '#3B82F6': 'info',
  
  // Grays
  '#1D1D1F': 'vergil-off-black',
  '#F5F5F7': 'vergil-off-white',
  '#FFFFFF': 'pure-light',
  '#FAFAFA': 'soft-light',
  '#F8F9FA': 'whisper-gray',
  '#F3F4F6': 'gray-100',
  '#E5E7EB': 'mist-gray',
  '#9CA3AF': 'stone-gray',
  '#6B7280': 'gray-500',
  '#4B5563': 'gray-600',
  '#1F2937': 'gray-800',
  '#0F172A': 'deep-space',
  
  // Additional colors from components
  '#FF6600': 'warning', // maps to orange warning color
};

// Spacing mappings from px values to tokens
const spacingMappings = {
  '4px': 'xs',
  '8px': 'sm',
  '16px': 'md',
  '24px': 'lg',
  '32px': 'xl',
  '48px': '2xl',
  '64px': '3xl',
  
  // Common patterns
  '12px': 'sm + xs', // 8px + 4px
  '20px': 'md + xs', // 16px + 4px
  '40px': 'xl + sm', // 32px + 8px
  '56px': '2xl + sm', // 48px + 8px
};

// Shadow mappings
const shadowMappings = {
  'shadow-sm': 'shadow-card',
  'shadow': 'shadow-card',
  'shadow-md': 'shadow-cardHover',
  'shadow-lg': 'shadow-dropdown',
  'shadow-xl': 'shadow-modal',
  'shadow-2xl': 'shadow-modal',
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let changes = [];

  // Replace hex colors in className strings
  Object.entries(colorMappings).forEach(([hex, token]) => {
    // Replace bg-[#hexcode]
    const bgRegex = new RegExp(`bg-\\[${hex.replace('#', '#?')}\\]`, 'gi');
    content = content.replace(bgRegex, (match) => {
      changes.push(`Replaced ${match} with bg-${token}`);
      return `bg-${token}`;
    });

    // Replace text-[#hexcode]
    const textRegex = new RegExp(`text-\\[${hex.replace('#', '#?')}\\]`, 'gi');
    content = content.replace(textRegex, (match) => {
      changes.push(`Replaced ${match} with text-${token}`);
      return `text-${token}`;
    });

    // Replace border-[#hexcode]
    const borderRegex = new RegExp(`border-\\[${hex.replace('#', '#?')}\\]`, 'gi');
    content = content.replace(borderRegex, (match) => {
      changes.push(`Replaced ${match} with border-${token}`);
      return `border-${token}`;
    });

    // Replace hex in style objects and inline styles
    const styleRegex = new RegExp(`(['"\`])${hex}\\1`, 'gi');
    content = content.replace(styleRegex, (match, quote) => {
      changes.push(`Replaced ${match} with semantic color reference`);
      return `${quote}var(--color-${token})${quote}`;
    });
  });

  // Replace arbitrary spacing values
  Object.entries(spacingMappings).forEach(([px, token]) => {
    // Replace p-[24px] -> p-lg
    const paddingRegex = new RegExp(`p-\\[${px}\\]`, 'g');
    content = content.replace(paddingRegex, (match) => {
      changes.push(`Replaced ${match} with p-${token}`);
      return `p-${token}`;
    });

    // Replace m-[24px] -> m-lg
    const marginRegex = new RegExp(`m-\\[${px}\\]`, 'g');
    content = content.replace(marginRegex, (match) => {
      changes.push(`Replaced ${match} with m-${token}`);
      return `m-${token}`;
    });

    // Replace gap-[24px] -> gap-lg
    const gapRegex = new RegExp(`gap-\\[${px}\\]`, 'g');
    content = content.replace(gapRegex, (match) => {
      changes.push(`Replaced ${match} with gap-${token}`);
      return `gap-${token}`;
    });

    // Replace px/py/mx/my patterns
    ['px', 'py', 'mx', 'my'].forEach(prefix => {
      const regex = new RegExp(`${prefix}-\\[${px}\\]`, 'g');
      content = content.replace(regex, (match) => {
        changes.push(`Replaced ${match} with ${prefix}-${token}`);
        return `${prefix}-${token}`;
      });
    });
  });

  // Replace shadow utilities
  Object.entries(shadowMappings).forEach(([oldShadow, newShadow]) => {
    const shadowRegex = new RegExp(`\\b${oldShadow}\\b`, 'g');
    content = content.replace(shadowRegex, (match) => {
      changes.push(`Replaced ${match} with ${newShadow}`);
      return newShadow;
    });
  });

  // Write back if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`\n✅ Migrated ${filePath}`);
    changes.forEach(change => console.log(`   - ${change}`));
    return { file: filePath, changes };
  }

  return null;
}

function findFilesToMigrate() {
  const patterns = [
    'components/**/*.tsx',
    'app/**/*.tsx',
  ];

  const files = [];
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern, { 
      cwd: path.resolve(__dirname, '..'),
      ignore: ['**/node_modules/**', '**/.next/**']
    });
    files.push(...matches.map(f => path.resolve(__dirname, '..', f)));
  });

  return files;
}

function generateMigrationReport(migrations) {
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: migrations.length,
    migrations: migrations,
    summary: {
      colorReplacements: 0,
      spacingReplacements: 0,
      shadowReplacements: 0,
    }
  };

  migrations.forEach(({ changes }) => {
    changes.forEach(change => {
      if (change.includes('color') || change.includes('bg-') || change.includes('text-') || change.includes('border-')) {
        report.summary.colorReplacements++;
      } else if (change.includes('p-') || change.includes('m-') || change.includes('gap-') || change.includes('px-') || change.includes('py-')) {
        report.summary.spacingReplacements++;
      } else if (change.includes('shadow')) {
        report.summary.shadowReplacements++;
      }
    });
  });

  return report;
}

// Main execution
console.log('🚀 Starting token migration...\n');

const files = findFilesToMigrate();
console.log(`Found ${files.length} files to check for migration\n`);

const migrations = [];
files.forEach(file => {
  const result = migrateFile(file);
  if (result) {
    migrations.push(result);
  }
});

if (migrations.length > 0) {
  const report = generateMigrationReport(migrations);
  fs.writeFileSync(
    path.resolve(__dirname, '..', 'MIGRATION_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📊 Migration Summary:');
  console.log(`   - Files migrated: ${report.totalFiles}`);
  console.log(`   - Color replacements: ${report.summary.colorReplacements}`);
  console.log(`   - Spacing replacements: ${report.summary.spacingReplacements}`);
  console.log(`   - Shadow replacements: ${report.summary.shadowReplacements}`);
  console.log('\n✅ Migration complete! Report saved to MIGRATION_REPORT.json');
} else {
  console.log('\n✅ No files needed migration. All files are already using tokens!');
}