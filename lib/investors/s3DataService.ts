import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Readable } from 'stream';

export class S3DataService {
  private static client: S3Client | null = null;
  private static bucket: string;
  private static environment: string;
  
  // Cache for frequently accessed data
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_TTL = 60000; // 1 minute cache

  // Initialize S3 client
  private static getClient(): S3Client {
    if (!this.client) {
      // Use environment variables if available, otherwise use local file system
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        this.client = new S3Client({
          region: process.env.AWS_REGION || 'us-east-1',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
          }
        });
      } else {
        // Return null client for local development
        throw new Error('S3 credentials not configured');
      }
    }
    
    this.bucket = process.env.S3_BUCKET || 'generalvergilstorage';
    // Always use production path since that's where the data is stored
    this.environment = 'production';
    
    return this.client;
  }

  // Check if S3 is configured
  static isConfigured(): boolean {
    return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.S3_BUCKET);
  }

  // Read JSON from S3
  static async readJSON(filename: string): Promise<any> {
    // Check cache first
    const cached = this.cache.get(filename);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[S3] Cache hit for ${filename}`);
      return cached.data;
    }

    try {
      const client = this.getClient();
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: `vergil-investor-data/${this.environment}/${filename}`
      });
      
      console.log(`[S3] Reading vergil-investor-data/${this.environment}/${filename} from bucket ${this.bucket}`);
      const response = await client.send(command);
      
      if (!response.Body) {
        throw new Error('Empty response from S3');
      }

      // Convert stream to string
      const stream = response.Body as Readable;
      const chunks: Buffer[] = [];
      
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      
      const jsonString = Buffer.concat(chunks).toString('utf-8');
      const data = JSON.parse(jsonString);
      
      // Update cache
      this.cache.set(filename, { data, timestamp: Date.now() });
      console.log(`[S3] Successfully read ${filename}`);
      
      return data;
    } catch (error: any) {
      console.error(`[S3] Failed to read ${filename}:`, error.message);
      throw error;
    }
  }

  // Write JSON to S3
  static async writeJSON(filename: string, data: any): Promise<void> {
    try {
      const client = this.getClient();
      
      // Create backup first
      await this.createBackup(filename, data);
      
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: `vergil-investor-data/${this.environment}/${filename}`,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json',
        // Add metadata
        Metadata: {
          'last-modified': new Date().toISOString(),
          'environment': this.environment
        }
      });
      
      console.log(`[S3] Writing vergil-investor-data/${this.environment}/${filename} to bucket ${this.bucket}`);
      await client.send(command);
      
      // Invalidate cache
      this.cache.delete(filename);
      console.log(`[S3] Successfully wrote ${filename}`);
    } catch (error: any) {
      console.error(`[S3] Failed to write ${filename}:`, error.message);
      throw error;
    }
  }

  // Create backup before writing
  private static async createBackup(filename: string, data: any): Promise<void> {
    try {
      const client = this.getClient();
      const date = new Date().toISOString().split('T')[0];
      const timestamp = Date.now();
      
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: `vergil-investor-data/backups/daily/${date}/${filename}.${timestamp}`,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json',
        Metadata: {
          'original-filename': filename,
          'backup-date': new Date().toISOString(),
          'environment': this.environment
        }
      });
      
      console.log(`[S3] Creating backup: vergil-investor-data/backups/daily/${date}/${filename}.${timestamp}`);
      await client.send(command);
    } catch (error: any) {
      console.error(`[S3] Backup failed for ${filename}:`, error.message);
      // Don't throw - backups are non-critical
    }
  }

  // List all files in environment
  static async listFiles(): Promise<string[]> {
    try {
      const client = this.getClient();
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: `vergil-investor-data/${this.environment}/`,
        MaxKeys: 100
      });
      
      const response = await client.send(command);
      const files = response.Contents?.map(obj => obj.Key?.replace(`vergil-investor-data/${this.environment}/`, '') || '') || [];
      
      return files.filter(f => f.endsWith('.json'));
    } catch (error: any) {
      console.error('[S3] Failed to list files:', error.message);
      throw error;
    }
  }

  // Clear cache (useful for testing)
  static clearCache(): void {
    this.cache.clear();
    console.log('[S3] Cache cleared');
  }

  // Get cache stats
  static getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}