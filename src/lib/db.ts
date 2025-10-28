import { Pool, QueryResult, PoolClient, QueryConfig, QueryResultRow } from "pg";

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === "production";

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: true } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
});

// Function to query the database
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string | QueryConfig,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    // Log query execution time in development
    if (!isProduction) {
      console.log("Executed query", {
        text: typeof text === "string" ? text : text.text,
        duration,
        rows: res.rowCount,
      });
    }

    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Function to get a client from the pool
export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect();
  const originalRelease = client.release.bind(client);

  // Override release method
  client.release = () => {
    originalRelease();
  };

  // We're not overriding the query method due to typing issues
  // If logging is needed, use the separate query function above

  return client;
}

// Function to check database connection
export async function checkConnection(): Promise<{ now: Date }> {
  try {
    const result = await pool.query<{ now: Date }>("SELECT NOW() as now");
    return result.rows[0];
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

// Create a single export
const db = {
  query,
  getClient,
  checkConnection,
};

export default db;
