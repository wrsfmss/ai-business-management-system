-- BRAHMA Phase 5 durable outbox/inbox primitives
create table if not exists brahma_outbox (
  id bigint generated always as identity primary key,
  idempotency_key text not null unique,
  topic text not null,
  payload jsonb not null,
  published_at timestamptz,
  attempts integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists brahma_inbox (
  id bigint generated always as identity primary key,
  idempotency_key text not null unique,
  consumer text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_brahma_outbox_pending on brahma_outbox(created_at) where published_at is null;
create index if not exists idx_brahma_inbox_pending on brahma_inbox(created_at) where processed_at is null;
