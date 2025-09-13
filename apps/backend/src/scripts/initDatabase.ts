import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating tables and indexes...');
    await pool.query(schema);
    
    // Read and execute seed data
    const seedPath = path.join(__dirname, '../database/seed.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');
    
    console.log('🌱 Seeding initial data...');
    await pool.query(seedData);
    
    console.log('✅ Database initialized successfully!');
    
    // Test the connection with a simple query
    const result = await pool.query('SELECT COUNT(*) as user_count FROM users');
    console.log(`👥 Users in database: ${result.rows[0].user_count}`);
    
    const medicineResult = await pool.query('SELECT COUNT(*) as medicine_count FROM medicines');
    console.log(`💊 Medicines in database: ${medicineResult.rows[0].medicine_count}`);
    
    const patientResult = await pool.query('SELECT COUNT(*) as patient_count FROM patients');
    console.log(`🏥 Patients in database: ${patientResult.rows[0].patient_count}`);
    
  } catch (error) {
    console.error('💥 Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

export { initializeDatabase };