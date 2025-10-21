import { SQL } from "bun";

let db: SQL;

const prepareDb = async () => {
  db = new SQL(process.env.LOG_DB_URI!);

  await db`
    CREATE TABLE IF NOT EXISTS sms_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
};

const log = async (type: string, message: string) =>
  await db`INSERT INTO sms_logs (type, message) VALUES (${type}, ${message})`;

const getLogs = async (limit: number = 100) =>
  await db`SELECT * FROM sms_logs ORDER BY created_at DESC LIMIT ${limit}`;

export { prepareDb, log, getLogs };
