-- Run this in Supabase SQL editor
create table if not exists resources (
  name text primary key,
  price numeric,
  baseline_price numeric,
  delta_percent numeric,
  note text,
  updated_at timestamptz
);
