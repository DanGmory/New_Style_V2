import { testConnection } from './database.js';

async function test() {
  console.log('Testing database connection...');
  const success = await testConnection();
  if (success) {
    console.log('✅ All good! Database is ready for use.');
  } else {
    console.log('❌ Please check the database setup.');
  }
}

test();