// Supabase config loader
// Replace the placeholder strings with your Supabase project's values
// or configure your deployment to replace these tokens during build.

window.SUPABASE_URL = window.SUPABASE_URL || '%%SUPABASE_URL%%';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '%%SUPABASE_ANON_KEY%%';

// For Netlify, you can replace the placeholders during build using environment variables.
// Example (build pipeline): sed -i "s|%%SUPABASE_URL%%|$SUPABASE_URL|g" ./js/init-supabase.js && sed -i "s|%%SUPABASE_ANON_KEY%%|$SUPABASE_ANON_KEY|g" ./js/init-supabase.js

console.info('Supabase init script loaded — remember to replace placeholders with your project values.');