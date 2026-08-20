-- BRAHMA JARVIS Phase 5 core durable state
-- PostgreSQL/Supabase

create extension if not exists pgcrypto;

create table if not exists brahma_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  objective text not null,
  status text not null check (status in ('created','planned','running','waiting_attention','completed','failed','cancelled','blocked')),
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists brahma_executions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references brahma_tasks(id),
  status text not null check (status in ('queued','running','paused','waiting_attention','verifying','completed','failed','cancelled')),
  attempt integer not null default 0,
  checkpoint jsonb not null default '{}'::jsonb,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists brahma_execution_events (
  id bigint generated always as identity primary key,
  execution_id uuid not null references brahma_executions(id),
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists brahma_attention_requests (
  id uuid primary key default gen_random_uuid(),
  execution_id uuid not null references brahma_executions(id),
  status text not null check (status in ('pending','approved','rejected','deferred','expired','cancelled','superseded')),
  prompt text not null,
  decision_data jsonb,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists brahma_idempotency_keys (
  key text primary key,
  operation text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists brahma_audit_events (
  id bigint generated always as identity primary key,
  execution_id uuid,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_brahma_exec_task on brahma_executions(task_id);
create index if not exists idx_brahma_events_execution on brahma_execution_events(execution_id, created_at);
create index if not exists idx_brahma_attention_execution on brahma_attention_requests(execution_id);

-- Reconciliation must be performed in one transaction by the application/RPC layer.
-- No client is permitted to update execution status directly.
