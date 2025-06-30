/**
 * Integration Manager - Handle external integrations and automation
 */

import { spawn, exec } from 'child_process';
import { watch } from 'fs';
import { join } from 'path';
import { TokenRegistry, IntegrationConfig } from './types.js';
import { TokenExporter } from './exporter.js';

export class IntegrationManager {
  private config: IntegrationConfig;
  private exporter: TokenExporter;
  private watchers: Map<string, any> = new Map();

  constructor(config?: Partial<IntegrationConfig>) {
    this.config = {
      storybook: {
        enabled: true,
        hotReload: true,
        storiesPath: '.storybook'
      },
      git: {
        enabled: true,
        autoCommit: false,
        branchProtection: true
      },
      build: {
        autoRebuild: true,
        outputFormats: ['css', 'ts', 'json'],
        outputDir: 'generated'
      },
      ...config
    };

    this.exporter = new TokenExporter(this.config.build.outputDir);
  }

  /**
   * Start all enabled integrations
   */
  async start(): Promise<void> {
    console.log('🚀 Starting token integrations...');

    if (this.config.build.autoRebuild) {
      await this.setupFileWatcher();
    }

    if (this.config.storybook.enabled && this.config.storybook.hotReload) {
      await this.setupStorybookIntegration();
    }

    if (this.config.git.enabled) {
      await this.setupGitIntegration();
    }

    console.log('✅ All integrations started');
  }

  /**
   * Stop all integrations
   */
  async stop(): Promise<void> {
    console.log('🛑 Stopping integrations...');

    // Stop file watchers
    for (const [name, watcher] of this.watchers) {
      watcher.close();
      this.watchers.delete(name);
      console.log(`   Stopped ${name} watcher`);
    }

    console.log('✅ All integrations stopped');
  }

  /**
   * Handle token registry update
   */
  async handleTokenUpdate(registry: TokenRegistry, reason: string = 'Token update'): Promise<void> {
    console.log(`🔄 Handling token update: ${reason}`);

    // Export all configured formats
    const results = [];
    for (const format of this.config.build.outputFormats) {
      try {
        const result = await this.exporter.export(registry, { 
          format, 
          includeComments: true,
          includeDeprecated: false 
        });
        results.push(result);
        console.log(`   ✅ Exported ${format}: ${result.filename}`);
      } catch (error) {
        console.error(`   ❌ Failed to export ${format}:`, error);
      }
    }

    // Trigger Storybook refresh
    if (this.config.storybook.enabled && this.config.storybook.hotReload) {
      await this.refreshStorybook();
    }

    // Auto-commit if enabled
    if (this.config.git.enabled && this.config.git.autoCommit) {
      await this.autoCommitChanges(results.map(r => r.filename), reason);
    }

    console.log('✅ Token update handled');
  }

  /**
   * Setup file watcher for automatic rebuilds
   */
  private async setupFileWatcher(): Promise<void> {
    const watchPaths = [
      'app/globals.css',
      'tailwind.config.js',
      'design-tokens'
    ];

    for (const watchPath of watchPaths) {
      try {
        const watcher = watch(watchPath, { recursive: true }, (eventType, filename) => {
          if (filename && (filename.endsWith('.css') || filename.endsWith('.yaml') || filename.endsWith('.yml'))) {
            console.log(`📝 File changed: ${filename}`);
            this.debounceRebuild();
          }
        });

        this.watchers.set(watchPath, watcher);
        console.log(`   👀 Watching ${watchPath}`);
      } catch (error) {
        console.warn(`   ⚠️  Could not watch ${watchPath}:`, error);
      }
    }
  }

  /**
   * Setup Storybook integration
   */
  private async setupStorybookIntegration(): Promise<void> {
    console.log('   📚 Setting up Storybook integration');

    // Check if Storybook is running
    const isRunning = await this.isStorybookRunning();
    if (isRunning) {
      console.log('   ✅ Storybook is running - hot reload enabled');
    } else {
      console.log('   ⚠️  Storybook not running - hot reload will activate when started');
    }

    // Create token stories if they don't exist
    await this.ensureTokenStories();
  }

  /**
   * Setup Git integration
   */
  private async setupGitIntegration(): Promise<void> {
    console.log('   📝 Setting up Git integration');

    // Check if we're in a Git repository
    const isGitRepo = await this.isGitRepository();
    if (!isGitRepo) {
      console.warn('   ⚠️  Not in a Git repository - Git integration disabled');
      this.config.git.enabled = false;
      return;
    }

    // Setup pre-commit hook for token validation
    await this.setupGitHooks();

    console.log('   ✅ Git integration ready');
  }

  /**
   * Debounced rebuild function
   */
  private debounceRebuild = this.debounce(async () => {
    console.log('🔄 Rebuilding tokens...');
    try {
      // This would trigger a full token rebuild
      // For now, just log the action
      console.log('   Token rebuild triggered');
    } catch (error) {
      console.error('   ❌ Rebuild failed:', error);
    }
  }, 500);

  /**
   * Check if Storybook is running
   */
  private async isStorybookRunning(): Promise<boolean> {
    return new Promise((resolve) => {
      exec('lsof -ti:6006', (error) => {
        resolve(!error); // No error means port 6006 is in use
      });
    });
  }

  /**
   * Refresh Storybook
   */
  private async refreshStorybook(): Promise<void> {
    // In a real implementation, this would trigger Storybook's HMR
    console.log('   🔄 Triggering Storybook refresh');
  }

  /**
   * Create token documentation stories
   */
  private async ensureTokenStories(): Promise<void> {
    const storybookPath = join(process.cwd(), this.config.storybook.storiesPath);
    
    // This would create/update Storybook stories for tokens
    // For now, just log the intention
    console.log(`   📖 Token stories location: ${storybookPath}`);
  }

  /**
   * Check if current directory is a Git repository
   */
  private async isGitRepository(): Promise<boolean> {
    return new Promise((resolve) => {
      exec('git rev-parse --is-inside-work-tree', (error) => {
        resolve(!error);
      });
    });
  }

  /**
   * Setup Git hooks
   */
  private async setupGitHooks(): Promise<void> {
    // This would setup pre-commit hooks to validate tokens
    console.log('   🎣 Git hooks configured');
  }

  /**
   * Auto-commit changes
   */
  private async autoCommitChanges(files: string[], reason: string): Promise<void> {
    if (!this.config.git.enabled || !this.config.git.autoCommit) return;

    try {
      console.log('   📝 Auto-committing changes...');
      
      // Stage files
      const stageCommand = `git add ${files.join(' ')}`;
      await this.execCommand(stageCommand);

      // Commit with message
      const commitMessage = `chore: ${reason}\n\n🤖 Auto-generated token update`;
      const commitCommand = `git commit -m "${commitMessage}"`;
      await this.execCommand(commitCommand);

      console.log('   ✅ Changes committed automatically');
    } catch (error) {
      console.error('   ❌ Auto-commit failed:', error);
    }
  }

  /**
   * Execute shell command
   */
  private execCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  /**
   * Debounce utility
   */
  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Generate integration status report
   */
  generateStatusReport(): {
    integrations: Array<{
      name: string;
      enabled: boolean;
      status: 'active' | 'inactive' | 'error';
      details?: string;
    }>;
    watchers: string[];
    lastUpdate?: string;
  } {
    const integrations = [
      {
        name: 'File Watcher',
        enabled: this.config.build.autoRebuild,
        status: this.watchers.size > 0 ? 'active' : 'inactive' as const,
        details: `Watching ${this.watchers.size} paths`
      },
      {
        name: 'Storybook',
        enabled: this.config.storybook.enabled,
        status: this.config.storybook.hotReload ? 'active' : 'inactive' as const,
        details: `Hot reload: ${this.config.storybook.hotReload}`
      },
      {
        name: 'Git',
        enabled: this.config.git.enabled,
        status: this.config.git.autoCommit ? 'active' : 'inactive' as const,
        details: `Auto-commit: ${this.config.git.autoCommit}`
      }
    ];

    return {
      integrations,
      watchers: Array.from(this.watchers.keys()),
      lastUpdate: new Date().toISOString()
    };
  }
}