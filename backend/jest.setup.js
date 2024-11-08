import pool from "./src/config/db";

beforeEach(async () => {
    await pool.query('BEGIN'); // Start transaction
  });
  
afterEach(async () => {
await pool.query('ROLLBACK'); // Rollback transaction
});