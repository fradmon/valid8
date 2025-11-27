import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gsjdrosapaelvefkpoxf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzamRyb3NhcGFlbHZlZmtwb3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTYyMjksImV4cCI6MjA3OTgzMjIyOX0.g5IXB9ayhUCwG_62lyWh87G6h57Z6KDSTthFFUIGLDY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

