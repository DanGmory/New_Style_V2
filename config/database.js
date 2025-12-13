import dotenv from 'dotenv';
import { createPool } from "mysql2/promise";

dotenv.config();

export const connect = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'New_style_user',
    password: process.env.DB_PASSWORD || 'NewStyle123',
    database: process.env.DB_NAME || 'db_new_style',
    port: parseInt(process.env.DB_PORT) || 3306
});

export async function testConnection() {
  let conn;
  try {
    conn = await connect.getConnection();
    console.log('✅ Connected to database successfully');
    
    // Test query to get database version
    const result = await conn.query('SELECT VERSION() as version');
    console.log(`📊 Database Version: ${result[0][0].version}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful debugging info
    switch (error.code) {
      case 'ER_ACCESS_DENIED_ERROR':
        console.log('💡 Check username and password in database configuration');
        break;
      case 'ER_BAD_DB_ERROR':
        console.log('💡 Check if database "db_new_style" exists');
        break;
      case 'ECONNREFUSED':
        console.log('💡 Check if database server is running on localhost:3306');
        console.log('   Run: sudo systemctl status mariadb (or mysql)');
        break;
      default:
        console.log('💡 Check database server status and credentials');
    }
    
    return false;
  } finally {
    if (conn) conn.release();
  }
}