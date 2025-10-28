#!/usr/bin/env node

/**
 * Script to set up Supabase database tables
 * Run with: node setup-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...\n');

  // Read the init.sql file
  const sqlFile = path.join(__dirname, 'sql', 'init.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  // Split by statements (simple split on semicolon followed by newline)
  const statements = sqlContent
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📄 Found ${statements.length} SQL statements\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    // Skip comments and empty statements
    if (statement.trim().startsWith('--') || statement.trim() === ';') {
      continue;
    }

    // Get a preview of the statement
    const preview = statement.substring(0, 60).replace(/\s+/g, ' ').trim();
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.log(`❌ Failed (${i + 1}/${statements.length}): ${preview}...`);
        console.log(`   Error: ${error.message}\n`);
        errorCount++;
      } else {
        console.log(`✅ Success (${i + 1}/${statements.length}): ${preview}...`);
        successCount++;
      }
    } catch (err) {
      console.log(`❌ Failed (${i + 1}/${statements.length}): ${preview}...`);
      console.log(`   Error: ${err.message}\n`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log('='.repeat(50));

  if (errorCount === 0) {
    console.log('\n🎉 Database setup completed successfully!');
  } else {
    console.log('\n⚠️  Some statements failed. You may need to run them manually in the Supabase SQL Editor.');
  }
}

setupDatabase().catch(console.error);
