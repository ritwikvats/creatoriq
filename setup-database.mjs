#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = 'https://bbbhnymcuqwedxofdotg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYmhueW1jdXF3ZWR4b2Zkb3RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDA4Nzk0MywiZXhwIjoyMDg1NjYzOTQzfQ.yDGnhfB8Zsnye0wTtv8HqoOd9JxUOHdBxH8eUFCwSww';

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const sqlFiles = [
  'scripts/setup/create-tables.sql',
  'scripts/setup/create-deals-table.sql',
  'scripts/setup/auto-create-user-trigger.sql'
];

async function executeSql(sql) {
  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    if (statement.trim().length === 0) continue;

    try {
      const { data, error } = await supabase.rpc('exec_sql', { query: statement + ';' });
      if (error) {
        console.error(`   ⚠️  ${error.message}`);
      }
    } catch (err) {
      console.error(`   ⚠️  ${err.message}`);
    }
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up CreatorIQ database...\n');

  for (const sqlFile of sqlFiles) {
    const filePath = join(__dirname, sqlFile);
    console.log(`📄 Executing: ${sqlFile}`);

    try {
      const sql = readFileSync(filePath, 'utf8');
      await executeSql(sql);
      console.log(`   ✅ Completed\n`);
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('✅ Database setup complete!');
}

setupDatabase().catch((error) => {
  console.error('❌ Setup failed:', error.message);
  console.log('\n💡 Please run SQL scripts manually in Supabase SQL Editor:');
  console.log(`   ${SUPABASE_URL}/project/_/sql`);
  process.exit(1);
});
