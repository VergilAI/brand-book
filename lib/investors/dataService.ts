import { promises as fs } from 'fs';
import path from 'path';
import { S3DataService } from './s3DataService';

// Unified data service that can use either S3 or local files
export class DataService {
  private static dataDir = path.join(process.cwd(), 'app', 'investors', 'data');
  
  // Determine if we should use S3 or local files
  private static useS3(): boolean {
    // Use local files if explicitly set or if S3 is not configured
    if (process.env.USE_LOCAL_FILES === 'true' || !S3DataService.isConfigured()) {
      return false;
    }
    return true;
  }

  // Read JSON data
  static async readJSON(filename: string): Promise<any> {
    if (this.useS3()) {
      try {
        console.log(`[DataService] Reading ${filename} from S3`);
        return await S3DataService.readJSON(filename);
      } catch (error) {
        console.error(`[DataService] S3 read failed for ${filename}, falling back to local:`, error);
        // Fallback to local file if S3 fails
        return this.readLocalJSON(filename);
      }
    } else {
      console.log(`[DataService] Reading ${filename} from local filesystem`);
      return this.readLocalJSON(filename);
    }
  }

  // Write JSON data
  static async writeJSON(filename: string, data: any): Promise<void> {
    if (this.useS3()) {
      try {
        console.log(`[DataService] Writing ${filename} to S3`);
        await S3DataService.writeJSON(filename, data);
        
        // Also write to local as backup in development
        if (process.env.NODE_ENV !== 'production') {
          await this.writeLocalJSON(filename, data);
        }
      } catch (error) {
        console.error(`[DataService] S3 write failed for ${filename}, falling back to local:`, error);
        // Fallback to local file if S3 fails
        await this.writeLocalJSON(filename, data);
      }
    } else {
      console.log(`[DataService] Writing ${filename} to local filesystem`);
      await this.writeLocalJSON(filename, data);
    }
  }

  // Read from local filesystem
  private static async readLocalJSON(filename: string): Promise<any> {
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`[DataService] Failed to read local file ${filename}:`, error);
      
      // Return default structure based on filename
      if (filename === 'users.json') return { users: [] };
      if (filename === 'balances.json') return { balances: [] };
      if (filename === 'expenses.json') return { expenses: [] };
      if (filename === 'revenues.json') return { revenues: [] };
      if (filename === 'hypotheticals.json') return { hypotheticals: [] };
      
      throw error;
    }
  }

  // Write to local filesystem
  private static async writeLocalJSON(filename: string, data: any): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`[DataService] Failed to write local file ${filename}:`, error);
      throw error;
    }
  }

  // Get service status
  static getStatus(): { mode: 'S3' | 'local'; s3Configured: boolean } {
    return {
      mode: this.useS3() ? 'S3' : 'local',
      s3Configured: S3DataService.isConfigured()
    };
  }

  // Migrate local files to S3 (utility function)
  static async migrateToS3(): Promise<{ success: string[]; failed: string[] }> {
    const files = ['users.json', 'balances.json', 'expenses.json', 'revenues.json', 'hypotheticals.json'];
    const results = { success: [] as string[], failed: [] as string[] };
    
    if (!S3DataService.isConfigured()) {
      throw new Error('S3 is not configured. Please set AWS credentials.');
    }
    
    for (const file of files) {
      try {
        console.log(`[Migration] Migrating ${file}...`);
        const data = await this.readLocalJSON(file);
        await S3DataService.writeJSON(file, data);
        results.success.push(file);
        console.log(`[Migration] ✅ ${file} migrated successfully`);
      } catch (error) {
        console.error(`[Migration] ❌ Failed to migrate ${file}:`, error);
        results.failed.push(file);
      }
    }
    
    return results;
  }
}