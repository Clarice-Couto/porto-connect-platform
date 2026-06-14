const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'init-supabase.js');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
  
  console.log('Replacing Supabase environment variables during build...');
  console.log('SUPABASE_URL present:', !!supabaseUrl);
  console.log('SUPABASE_ANON_KEY present:', !!supabaseAnonKey);

  content = content.replace('%%SUPABASE_URL%%', supabaseUrl);
  content = content.replace('%%SUPABASE_ANON_KEY%%', supabaseAnonKey);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Replacement complete!');
} else {
  console.error('Error: js/init-supabase.js not found!');
  process.exit(1);
}
