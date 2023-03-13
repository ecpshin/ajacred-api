const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cdkbabubixqefpswywim.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNka2JhYnViaXhxZWZwc3d5d2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc3ODc2ODYsImV4cCI6MTk5MzM2MzY4Nn0.yzu2oEwtEjTpDFK4FfKd_0v0pVEBrE2gEv67cewjH2M'
);

module.exports = supabase;
