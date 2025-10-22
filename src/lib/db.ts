import { SQL } from "bun";
import logger from "@/lib/utils/log";

interface SmsLog {
  id: number;
  type: string;
  message: string;
  created_at: string;
}

class DB {
  private db: SQL;
  private static instance: DB;

  private constructor() {
    try {
      this.db = new SQL(process.env.LOG_DB_URI!);
      this.initTables();
      logger.db(`Database initialized successfully`);
    } catch (error) {
      logger.error(`Failed to initialize database: ${error}`);
      throw error;
    }
  }

  public static getInstance(): DB {
    if (!DB.instance) DB.instance = new DB();

    return DB.instance;
  }

  private async initTables(): Promise<void> {
    try {
      // Détecte le type de base de données à partir de l'URI
      const dbUri = process.env.LOG_DB_URI || "";
      const isSQLite = dbUri.includes("sqlite") || dbUri.endsWith(".db");
      
      if (isSQLite) {
        // Syntaxe SQLite
        await this.db`
          CREATE TABLE IF NOT EXISTS sms_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `;
        // Créer les index séparément pour SQLite
        await this.db`CREATE INDEX IF NOT EXISTS idx_type ON sms_logs(type);`;
        await this.db`CREATE INDEX IF NOT EXISTS idx_created_at ON sms_logs(created_at);`;
      } else {
        // Syntaxe MySQL/MariaDB
        await this.db`
          CREATE TABLE IF NOT EXISTS sms_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_type (type),
            INDEX idx_created_at (created_at)
          );
        `;
      }
      
      logger.db("Database tables created successfully");
    } catch (error) {
      logger.error(`Failed to create tables: ${error}`);
      throw error;
    }
  }

  public async log(type: string, message: string): Promise<number> {
    try {
      const result = await this.db`
        INSERT INTO sms_logs (type, message) 
        VALUES (${type}, ${message})
      `;
      const insertId = result.lastInsertId || 0;
      logger.db(`Log inserted with ID: ${insertId}`);
      return insertId as number;
    } catch (error) {
      logger.error(`Failed to insert log: ${error}`);
      throw error;
    }
  }

  public async getLogs(limit: number = 100): Promise<SmsLog[]> {
    try {
      const logs = await this.db`
        SELECT * FROM sms_logs 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `;
      return logs as SmsLog[];
    } catch (error) {
      logger.error(`Failed to retrieve logs: ${error}`);
      throw error;
    }
  }

  public async getLogsByType(type: string, limit: number = 100): Promise<SmsLog[]> {
    try {
      const logs = await this.db`
        SELECT * FROM sms_logs 
        WHERE type = ${type}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `;
      return logs as SmsLog[];
    } catch (error) {
      logger.error(`Failed to retrieve logs by type: ${error}`);
      throw error;
    }
  }

  public async cleanOldLogs(daysToKeep: number = 30): Promise<number> {
    try {
      const dbUri = process.env.LOG_DB_URI || "";
      const isSQLite = dbUri.includes("sqlite") || dbUri.endsWith(".db");
      
      let result;
      if (isSQLite) {
        // Syntaxe SQLite
        result = await this.db`
          DELETE FROM sms_logs 
          WHERE created_at < datetime('now', '-' || ${daysToKeep} || ' days')
        `;
      } else {
        // Syntaxe MySQL/MariaDB
        result = await this.db`
          DELETE FROM sms_logs 
          WHERE created_at < DATE_SUB(NOW(), INTERVAL ${daysToKeep} DAY)
        `;
      }
      
      const affectedRows = result.affectedRows || result.changes || 0;
      logger.db(`${affectedRows} logs deleted`);
      return affectedRows as number;
    } catch (error) {
      logger.error(`Failed to clean old logs: ${error}`);
      throw error;
    }
  }

  public async countLogs(): Promise<number> {
    try {
      const result = await this.db`
        SELECT COUNT(*) as count FROM sms_logs
      `;
      return (result[0] as { count: number }).count;
    } catch (error) {
      logger.error(`Failed to count logs: ${error}`);
      throw error;
    }
  }

  public async countLogsByType(): Promise<Record<string, number>> {
    try {
      const result = await this.db`
        SELECT type, COUNT(*) as count 
        FROM sms_logs 
        GROUP BY type
      `;
      const counts: Record<string, number> = {};
      for (const row of result as Array<{ type: string; count: number }>) {
        counts[row.type] = row.count;
      }
      return counts;
    } catch (error) {
      logger.error(`Failed to count logs by type: ${error}`);
      throw error;
    }
  }

  public async getLogsByDateRange(startDate: Date, endDate: Date): Promise<SmsLog[]> {
    try {
      const logs = await this.db`
        SELECT * FROM sms_logs 
        WHERE created_at BETWEEN ${startDate} AND ${endDate}
        ORDER BY created_at DESC
      `;
      return logs as SmsLog[];
    } catch (error) {
      logger.error(`Failed to retrieve logs by date range: ${error}`);
      throw error;
    }
  }

  public async query(strings: TemplateStringsArray, ...values: any[]): Promise<any> {
    try {
      return await this.db(strings, ...values);
    } catch (error) {
      logger.error(`Failed to execute query: ${error}`);
      throw error;
    }
  }

  public close(): void {
    try {
      // Bun SQL handles connections automatically
      logger.db("Database connection closed");
    } catch (error) {
      logger.error(`Failed to close database connection: ${error}`);
      throw error;
    }
  }

  public getConnection(): SQL {
    return this.db;
  }
}

export default DB.getInstance();
export { DB };
