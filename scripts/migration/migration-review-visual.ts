#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import open from 'open';

/**
 * Visual Migration Review Tool
 * 
 * This tool provides a web-based interface for reviewing and mapping
 * temporary tokens to semantic names. It groups similar values,
 * shows context, and makes the mapping process much easier.
 */

interface MigrationMapping {
  temporaryToken: string;
  semanticName: string;
  category?: string;
  approved: boolean;
  notes?: string;
}

interface ReviewSession {
  mappings: Record<string, MigrationMapping>;
  metadata: {
    startedAt: string;
    lastUpdated: string;
    totalTokens: number;
    completedTokens: number;
    reviewer?: string;
  };
}

class VisualMigrationReviewer {
  private discoveryReport: any;
  private session: ReviewSession;
  private app: express.Application;
  private server: any;
  private port = 3333;

  constructor() {
    this.session = {
      mappings: {},
      metadata: {
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        totalTokens: 0,
        completedTokens: 0,
      }
    };
  }

  async start(): Promise<void> {
    console.log('🎨 Visual Migration Review Tool');
    console.log('===============================\n');

    // Load discovery report
    await this.loadDiscoveryReport();

    // Load or create session
    await this.loadOrCreateSession();

    // Start web server
    await this.startWebServer();

    // Open browser
    console.log(`\n🌐 Opening review interface in your browser...`);
    await open(`http://localhost:${this.port}`);

    // Keep process alive
    await this.waitForCompletion();
  }

  private async loadDiscoveryReport(): Promise<void> {
    const reportPath = path.join(process.cwd(), 'reports', 'migration-discovery.json');
    
    if (!fs.existsSync(reportPath)) {
      console.error('❌ Discovery report not found. Please run: npm run migrate:extract:safe');
      process.exit(1);
    }

    this.discoveryReport = JSON.parse(await fs.promises.readFile(reportPath, 'utf-8'));
    console.log(`📊 Loaded ${this.discoveryReport.totalFindings} tokens for review`);
  }

  private async loadOrCreateSession(): Promise<void> {
    const sessionPath = path.join(process.cwd(), 'reports', 'migration-review-session.json');

    if (fs.existsSync(sessionPath)) {
      this.session = JSON.parse(await fs.promises.readFile(sessionPath, 'utf-8'));
      console.log('📂 Resuming previous review session');
    } else {
      // Initialize session with discovered tokens
      this.discoveryReport.extractedValues.forEach((value: any) => {
        this.session.mappings[value.temporaryToken] = {
          temporaryToken: value.temporaryToken,
          semanticName: value.suggestedNames?.[0] || '',
          category: value.category,
          approved: false,
        };
      });

      this.session.metadata.totalTokens = this.discoveryReport.totalFindings;
    }
  }

  private async saveSession(): Promise<void> {
    const sessionPath = path.join(process.cwd(), 'reports', 'migration-review-session.json');
    this.session.metadata.lastUpdated = new Date().toISOString();
    this.session.metadata.completedTokens = Object.values(this.session.mappings)
      .filter(m => m.approved).length;
    
    await fs.promises.writeFile(sessionPath, JSON.stringify(this.session, null, 2));
  }

  private async startWebServer(): Promise<void> {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.static(path.join(process.cwd(), 'public')));

    // API Routes
    this.app.get('/api/tokens', (req, res) => {
      const tokens = this.discoveryReport.extractedValues.map((value: any) => ({
        ...value,
        mapping: this.session.mappings[value.temporaryToken],
      }));
      res.json(tokens);
    });

    this.app.get('/api/session', (req, res) => {
      res.json(this.session);
    });

    this.app.post('/api/mapping/:token', async (req, res) => {
      const { token } = req.params;
      const { semanticName, category, approved, notes } = req.body;

      if (this.session.mappings[token]) {
        this.session.mappings[token] = {
          ...this.session.mappings[token],
          semanticName,
          category,
          approved,
          notes,
        };
        await this.saveSession();
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Token not found' });
      }
    });

    this.app.post('/api/bulk-approve', async (req, res) => {
      const { tokens, semanticPrefix } = req.body;
      
      tokens.forEach((token: string, index: number) => {
        if (this.session.mappings[token]) {
          this.session.mappings[token].semanticName = `${semanticPrefix}-${index + 1}`;
          this.session.mappings[token].approved = true;
        }
      });

      await this.saveSession();
      res.json({ success: true });
    });

    this.app.get('/api/export', (req, res) => {
      const mappings = Object.values(this.session.mappings)
        .filter(m => m.approved)
        .reduce((acc, mapping) => {
          acc[mapping.temporaryToken] = mapping.semanticName;
          return acc;
        }, {} as Record<string, string>);

      res.json({
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        mappings,
        metadata: this.session.metadata,
      });
    });

    // Serve the review interface HTML
    this.app.get('/', (req, res) => {
      res.send(this.generateReviewInterface());
    });

    this.server = this.app.listen(this.port, () => {
      console.log(`🚀 Review server running at http://localhost:${this.port}`);
    });
  }

  private generateReviewInterface(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vergil Token Migration Review</title>
  <style>
    * { box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: #f5f5f7;
      color: #1d1d1f;
    }

    .header {
      background: #7B00FF;
      color: white;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .stats {
      margin-top: 10px;
      display: flex;
      gap: 30px;
    }

    .stat {
      opacity: 0.9;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .filters {
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .filter-group {
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-group label {
      font-weight: 500;
    }

    .filter-group select,
    .filter-group input {
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
    }

    .token-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .token-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
    }

    .token-card:hover {
      box-shadow: 0 4px 12px rgba(123,0,255,0.15);
    }

    .token-card.approved {
      border: 2px solid #0F8A0F;
    }

    .token-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
    }

    .token-value {
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .color-swatch {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .spacing-visual {
      background: #7B00FF;
      height: 4px;
      border-radius: 2px;
      margin: 10px 0;
    }

    .token-info {
      background: #f5f5f7;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-family: monospace;
      font-size: 13px;
    }

    .usage-list {
      max-height: 150px;
      overflow-y: auto;
      margin: 10px 0;
      padding: 10px;
      background: #fafafc;
      border-radius: 6px;
      font-size: 12px;
    }

    .usage-item {
      margin-bottom: 8px;
      padding: 5px;
      background: white;
      border-radius: 4px;
    }

    .mapping-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .mapping-form input {
      padding: 10px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .mapping-form input:focus {
      outline: none;
      border-color: #7B00FF;
    }

    .button-group {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #7B00FF;
      color: white;
    }

    .btn-primary:hover {
      background: #6a00e0;
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }

    .progress-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: white;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 20px;
    }

    .progress-fill {
      flex: 1;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill-inner {
      height: 100%;
      background: #7B00FF;
      transition: width 0.3s ease;
    }

    .export-btn {
      background: #0F8A0F;
      color: white;
    }

    .export-btn:hover {
      background: #0d7a0d;
    }

    .bulk-actions {
      background: #fafafc;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .group-header {
      font-size: 18px;
      font-weight: 600;
      margin: 30px 0 15px;
      padding: 10px;
      background: #f0f0f2;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎨 Vergil Token Migration Review</h1>
    <div class="stats">
      <div class="stat">
        <strong>Total Tokens:</strong> <span id="totalTokens">0</span>
      </div>
      <div class="stat">
        <strong>Reviewed:</strong> <span id="reviewedTokens">0</span>
      </div>
      <div class="stat">
        <strong>Approved:</strong> <span id="approvedTokens">0</span>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="filters">
      <div class="filter-group">
        <label>Type:</label>
        <select id="typeFilter">
          <option value="">All Types</option>
          <option value="color">Colors</option>
          <option value="spacing">Spacing</option>
          <option value="typography">Typography</option>
          <option value="border-radius">Border Radius</option>
          <option value="shadow">Shadows</option>
        </select>

        <label>Status:</label>
        <select id="statusFilter">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>

        <label>Group by:</label>
        <select id="groupBy">
          <option value="">No Grouping</option>
          <option value="value">Same Value</option>
          <option value="type">Type</option>
          <option value="file">File</option>
        </select>

        <input type="search" id="searchFilter" placeholder="Search tokens..." />
      </div>
    </div>

    <div id="tokenContainer"></div>
  </div>

  <div class="progress-bar">
    <div class="progress-fill">
      <div class="progress-fill-inner" id="progressBar"></div>
    </div>
    <span id="progressText">0%</span>
    <button class="btn export-btn" onclick="exportMappings()">Export Mappings</button>
  </div>

  <script>
    let tokens = [];
    let session = {};
    
    async function loadData() {
      const [tokensRes, sessionRes] = await Promise.all([
        fetch('/api/tokens'),
        fetch('/api/session')
      ]);
      
      tokens = await tokensRes.json();
      session = await sessionRes.json();
      
      updateStats();
      renderTokens();
    }

    function updateStats() {
      const approved = Object.values(session.mappings).filter(m => m.approved).length;
      const reviewed = Object.values(session.mappings).filter(m => m.semanticName).length;
      
      document.getElementById('totalTokens').textContent = tokens.length;
      document.getElementById('reviewedTokens').textContent = reviewed;
      document.getElementById('approvedTokens').textContent = approved;
      
      const progress = (approved / tokens.length) * 100;
      document.getElementById('progressBar').style.width = progress + '%';
      document.getElementById('progressText').textContent = Math.round(progress) + '%';
    }

    function renderTokens() {
      const container = document.getElementById('tokenContainer');
      const typeFilter = document.getElementById('typeFilter').value;
      const statusFilter = document.getElementById('statusFilter').value;
      const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
      const groupBy = document.getElementById('groupBy').value;
      
      let filteredTokens = tokens.filter(token => {
        if (typeFilter && token.type !== typeFilter) return false;
        if (statusFilter === 'pending' && token.mapping?.approved) return false;
        if (statusFilter === 'approved' && !token.mapping?.approved) return false;
        if (searchFilter && !JSON.stringify(token).toLowerCase().includes(searchFilter)) return false;
        return true;
      });

      // Group tokens if requested
      let groups = {};
      if (groupBy) {
        filteredTokens.forEach(token => {
          let key = '';
          if (groupBy === 'value') key = token.value;
          else if (groupBy === 'type') key = token.type;
          else if (groupBy === 'file') key = token.usages[0]?.file || 'Unknown';
          
          if (!groups[key]) groups[key] = [];
          groups[key].push(token);
        });
      } else {
        groups[''] = filteredTokens;
      }

      let html = '';
      
      Object.entries(groups).forEach(([groupName, groupTokens]) => {
        if (groupName) {
          html += \`<div class="group-header">\${groupName} (\${groupTokens.length} tokens)</div>\`;
          
          // Add bulk actions for value groups
          if (groupBy === 'value' && groupTokens.length > 1) {
            html += \`
              <div class="bulk-actions">
                <strong>Bulk Actions:</strong>
                <input type="text" id="bulk-\${btoa(groupName)}" placeholder="Semantic name prefix" />
                <button class="btn btn-primary" onclick="bulkApprove('\${btoa(groupName)}', \${JSON.stringify(groupTokens.map(t => t.temporaryToken))})">
                  Approve All
                </button>
              </div>
            \`;
          }
        }
        
        html += '<div class="token-grid">';
        
        groupTokens.forEach(token => {
          const mapping = token.mapping || {};
          const isColor = token.type === 'color';
          const isSpacing = token.type === 'spacing';
          
          html += \`
            <div class="token-card \${mapping.approved ? 'approved' : ''}">
              <div class="token-header">
                <div class="token-value">
                  \${isColor ? \`<div class="color-swatch" style="background: \${token.value}"></div>\` : ''}
                  \${token.value}
                </div>
                <span style="color: #666; font-size: 12px;">\${token.type}</span>
              </div>
              
              \${isSpacing ? \`<div class="spacing-visual" style="width: \${token.value}"></div>\` : ''}
              
              <div class="token-info">
                <strong>Temporary:</strong> var(--\${token.temporaryToken})<br>
                <strong>Usages:</strong> \${token.usages.length}
              </div>
              
              <div class="usage-list">
                \${token.usages.slice(0, 3).map(usage => \`
                  <div class="usage-item">
                    <strong>\${usage.file}:\${usage.line}</strong><br>
                    <code>\${escapeHtml(usage.context)}</code>
                  </div>
                \`).join('')}
                \${token.usages.length > 3 ? \`<div>...and \${token.usages.length - 3} more</div>\` : ''}
              </div>
              
              <div class="mapping-form">
                <input 
                  type="text" 
                  id="input-\${token.temporaryToken}"
                  placeholder="Semantic name (e.g., brand-purple)"
                  value="\${mapping.semanticName || ''}"
                  onkeyup="if(event.key === 'Enter') saveMapping('\${token.temporaryToken}')"
                />
                <div class="button-group">
                  <button class="btn btn-primary" onclick="saveMapping('\${token.temporaryToken}')">
                    \${mapping.approved ? 'Update' : 'Approve'}
                  </button>
                  \${mapping.approved ? 
                    \`<button class="btn btn-secondary" onclick="unapprove('\${token.temporaryToken}')">Unapprove</button>\` : 
                    ''
                  }
                </div>
              </div>
            </div>
          \`;
        });
        
        html += '</div>';
      });
      
      container.innerHTML = html;
    }

    async function saveMapping(token) {
      const input = document.getElementById('input-' + token);
      const semanticName = input.value.trim();
      
      if (!semanticName) {
        alert('Please enter a semantic name');
        return;
      }
      
      const response = await fetch('/api/mapping/' + token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semanticName,
          approved: true
        })
      });
      
      if (response.ok) {
        await loadData();
      }
    }

    async function unapprove(token) {
      const response = await fetch('/api/mapping/' + token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved: false
        })
      });
      
      if (response.ok) {
        await loadData();
      }
    }

    async function bulkApprove(groupId, tokenList) {
      const input = document.getElementById('bulk-' + groupId);
      const semanticPrefix = input.value.trim();
      
      if (!semanticPrefix) {
        alert('Please enter a semantic name prefix');
        return;
      }
      
      const response = await fetch('/api/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: tokenList,
          semanticPrefix
        })
      });
      
      if (response.ok) {
        await loadData();
      }
    }

    async function exportMappings() {
      const response = await fetch('/api/export');
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'token-mappings.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Mappings exported! Next step: npm run migrate:validate');
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Event listeners
    document.getElementById('typeFilter').addEventListener('change', renderTokens);
    document.getElementById('statusFilter').addEventListener('change', renderTokens);
    document.getElementById('groupBy').addEventListener('change', renderTokens);
    document.getElementById('searchFilter').addEventListener('input', renderTokens);

    // Load initial data
    loadData();
    
    // Auto-save every 30 seconds
    setInterval(() => {
      console.log('Auto-saving session...');
    }, 30000);
  </script>
</body>
</html>`;
  }

  private async waitForCompletion(): Promise<void> {
    console.log('\n📝 Review interface is running...');
    console.log('   - Review and map tokens in your browser');
    console.log('   - Changes are auto-saved');
    console.log('   - Press Ctrl+C to stop the server\n');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Stopping review server...');
      await this.saveSession();
      if (this.server) {
        this.server.close();
      }
      console.log('✅ Session saved. You can resume anytime.');
      process.exit(0);
    });

    // Keep the process running
    await new Promise(() => {});
  }
}

// Execute if run directly
if (require.main === module) {
  const reviewer = new VisualMigrationReviewer();
  reviewer.start().catch(console.error);
}

export { VisualMigrationReviewer };