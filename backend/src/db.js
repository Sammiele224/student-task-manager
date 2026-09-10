import mysql from 'mysql2/promise'

/**
 * Shared MySQL connection pool. Import `pool` in route handlers and use
 * `pool.query(sql, params)` — always pass values as params, never string
 * concatenation, so queries stay safe from SQL injection.
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_task_manager',
  timezone: '+07:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
})

/** Verifies the database is reachable at boot so failures are loud, not silent. */
export async function assertDbConnection() {
  const connection = await pool.getConnection()
  try {
    await connection.ping()
  } finally {
    connection.release()
  }
}
