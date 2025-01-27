import { createClient } from '@supabase/supabase-js';

const supabase_url = "https://svshfgivanaaeacxuclp.supabase.co";
const supabase_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2c2hmZ2l2YW5hYWVhY3h1Y2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDg3NDYsImV4cCI6MjA1MzMyNDc0Nn0.cXN3laQwQiNEK2VWLBlCJhpFq8g_iPQ_AwC6I3G9l3M";

export const supabase = createClient(
    supabase_url,
    supabase_anon_key
  );