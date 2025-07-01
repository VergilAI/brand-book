#!/usr/bin/env tsx

/**
 * Verification script to ensure all enforcement mechanisms are properly configured
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface VerificationResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

class EnforcementVerifier {
  private results: VerificationResult[] = [];

  async verify() {
    console.log('🔍 Verifying Design System Enforcement Setup...\n');

    // Check ESLint configuration
    this.checkESLintRules();
    
    // Check pre-commit hooks
    this.checkPreCommitHooks();
    
    // Check CI/CD workflows
    this.checkCIWorkflows();
    
    // Check package.json scripts
    this.checkScripts();
    
    // Test token validation
    this.testTokenValidation();
    
    // Display results
    this.displayResults();
  }

  private checkESLintRules() {
    console.log('📋 Checking ESLint rules...');
    
    try {
      // Check if ESLint config exists
      const eslintConfig = path.join(process.cwd(), '.eslintrc.js');
      if (!fs.existsSync(eslintConfig)) {
        this.results.push({
          name: 'ESLint Configuration',
          status: 'fail',
          message: '.eslintrc.js not found'
        });
        return;
      }

      // Check if plugin is configured
      const configContent = fs.readFileSync(eslintConfig, 'utf-8');
      if (!configContent.includes('@vergil/tokens')) {
        this.results.push({
          name: 'ESLint Token Plugin',
          status: 'fail',
          message: '@vergil/tokens plugin not configured'
        });
        return;
      }

      // Check if rules are enabled
      const rulesEnabled = [
        'no-hardcoded-colors',
        'no-hardcoded-spacing',
        'no-arbitrary-tailwind',
        'require-design-tokens'
      ];

      let enabledCount = 0;
      rulesEnabled.forEach(rule => {
        if (configContent.includes(`'@vergil/tokens/${rule}'`)) {
          enabledCount++;
        }
      });

      if (enabledCount === rulesEnabled.length) {
        this.results.push({
          name: 'ESLint Token Rules',
          status: 'pass',
          message: `All ${enabledCount} token rules are enabled`
        });
      } else {
        this.results.push({
          name: 'ESLint Token Rules',
          status: 'warning',
          message: `Only ${enabledCount}/${rulesEnabled.length} token rules are enabled`
        });
      }

    } catch (error) {
      this.results.push({
        name: 'ESLint Check',
        status: 'fail',
        message: `Error: ${error}`
      });
    }
  }

  private checkPreCommitHooks() {
    console.log('🪝 Checking pre-commit hooks...');
    
    try {
      // Check if husky is installed
      const huskyDir = path.join(process.cwd(), '.husky');
      if (!fs.existsSync(huskyDir)) {
        this.results.push({
          name: 'Husky Installation',
          status: 'fail',
          message: 'Husky not installed (.husky directory missing)'
        });
        return;
      }

      // Check pre-commit hook
      const preCommitHook = path.join(huskyDir, 'pre-commit');
      if (!fs.existsSync(preCommitHook)) {
        this.results.push({
          name: 'Pre-commit Hook',
          status: 'fail',
          message: 'Pre-commit hook not configured'
        });
        return;
      }

      const preCommitContent = fs.readFileSync(preCommitHook, 'utf-8');
      if (preCommitContent.includes('lint-staged')) {
        this.results.push({
          name: 'Pre-commit Hook',
          status: 'pass',
          message: 'Pre-commit hook with lint-staged configured'
        });
      } else {
        this.results.push({
          name: 'Pre-commit Hook',
          status: 'warning',
          message: 'Pre-commit hook exists but lint-staged not configured'
        });
      }

      // Check pre-push hook
      const prePushHook = path.join(huskyDir, 'pre-push');
      if (fs.existsSync(prePushHook)) {
        this.results.push({
          name: 'Pre-push Hook',
          status: 'pass',
          message: 'Pre-push validation configured'
        });
      } else {
        this.results.push({
          name: 'Pre-push Hook',
          status: 'warning',
          message: 'Pre-push hook not configured'
        });
      }

    } catch (error) {
      this.results.push({
        name: 'Git Hooks Check',
        status: 'fail',
        message: `Error: ${error}`
      });
    }
  }

  private checkCIWorkflows() {
    console.log('🚀 Checking CI/CD workflows...');
    
    try {
      const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
      
      if (!fs.existsSync(workflowsDir)) {
        this.results.push({
          name: 'GitHub Workflows',
          status: 'warning',
          message: '.github/workflows directory not found'
        });
        return;
      }

      // Check for token validation workflow
      const tokenValidationWorkflow = path.join(workflowsDir, 'token-validation.yml');
      if (fs.existsSync(tokenValidationWorkflow)) {
        this.results.push({
          name: 'Token Validation Workflow',
          status: 'pass',
          message: 'CI/CD token validation configured'
        });
      } else {
        this.results.push({
          name: 'Token Validation Workflow',
          status: 'fail',
          message: 'token-validation.yml not found'
        });
      }

      // Check for automated reporting
      const reportingWorkflow = path.join(workflowsDir, 'automated-reporting.yml');
      if (fs.existsSync(reportingWorkflow)) {
        this.results.push({
          name: 'Automated Reporting',
          status: 'pass',
          message: 'Weekly automated reports configured'
        });
      } else {
        this.results.push({
          name: 'Automated Reporting',
          status: 'warning',
          message: 'automated-reporting.yml not found'
        });
      }

    } catch (error) {
      this.results.push({
        name: 'CI/CD Check',
        status: 'fail',
        message: `Error: ${error}`
      });
    }
  }

  private checkScripts() {
    console.log('📦 Checking package.json scripts...');
    
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
      );

      const requiredScripts = [
        'lint:tokens',
        'scan:hardcoded',
        'validate-tokens',
        'report:all',
        'build:tokens'
      ];

      const missingScripts: string[] = [];
      requiredScripts.forEach(script => {
        if (!packageJson.scripts[script]) {
          missingScripts.push(script);
        }
      });

      if (missingScripts.length === 0) {
        this.results.push({
          name: 'NPM Scripts',
          status: 'pass',
          message: 'All required scripts configured'
        });
      } else {
        this.results.push({
          name: 'NPM Scripts',
          status: 'fail',
          message: `Missing scripts: ${missingScripts.join(', ')}`
        });
      }

    } catch (error) {
      this.results.push({
        name: 'Scripts Check',
        status: 'fail',
        message: `Error: ${error}`
      });
    }
  }

  private testTokenValidation() {
    console.log('🧪 Testing token validation...');
    
    try {
      // Test if validate-tokens command exists and runs
      const output = execSync('npm run validate-tokens 2>&1', { 
        stdio: 'pipe',
        encoding: 'utf-8'
      });
      
      this.results.push({
        name: 'Token Validation',
        status: 'pass',
        message: 'Token validation working correctly'
      });
    } catch (error: any) {
      const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.toString();
      
      // Check if it's a validation error (mismatches) vs actual failure
      if (errorOutput.includes('Token validation failed') || errorOutput.includes('Found') && errorOutput.includes('mismatches')) {
        this.results.push({
          name: 'Token Validation',
          status: 'warning',
          message: 'Token validation working but found mismatches (expected during migration)'
        });
      } else {
        this.results.push({
          name: 'Token Validation',
          status: 'fail',
          message: 'Token validation command failed to run'
        });
      }
    }
  }

  private displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VERIFICATION RESULTS\n');

    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;

    this.results.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : 
                   result.status === 'fail' ? '❌' : '⚠️';
      console.log(`${icon} ${result.name}`);
      console.log(`   ${result.message}\n`);
    });

    console.log('='.repeat(60));
    console.log('📈 SUMMARY:');
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⚠️  Warnings: ${warnings}`);
    console.log(`   📊 Total: ${this.results.length}`);
    
    const score = Math.round((passed / this.results.length) * 100);
    console.log(`\n   🎯 Enforcement Score: ${score}%`);
    
    if (failed > 0) {
      console.log('\n❗ Action Required: Fix failed checks to ensure proper enforcement.');
      process.exit(1);
    } else if (warnings > 0) {
      console.log('\n⚠️  Some optional features are not configured.');
    } else {
      console.log('\n✨ All enforcement mechanisms are properly configured!');
    }
  }
}

// Run verification
const verifier = new EnforcementVerifier();
verifier.verify().catch(console.error);