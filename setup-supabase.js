#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Dot - Supabase Setup\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local already exists');
} else {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your_openai_api_key

# Database Configuration
DATABASE_URL=your_database_url
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully');
}

console.log('\n📋 Next Steps:');
console.log('1. Go to https://supabase.com and create a new project');
console.log('2. Copy your project URL and anon key from Settings > API');
console.log('3. Update .env.local with your Supabase credentials');
console.log('4. Run the SQL schema in your Supabase SQL Editor');
console.log('5. Configure authentication settings in Supabase Dashboard');
console.log('\n📖 For detailed instructions, see SETUP.md'); 