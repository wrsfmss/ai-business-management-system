-- BRAHMA JARVIS Phase 5.9 durable attention
create table if not exists brahma_attention_decisions (
  id bigint generated always as identity primary key,
  attention_request_id uuid not null references brahma_attention_requests(id),
  decision text not null check (decision in ('approve','reject','defer','expire','cancel')),
  actor_id uuid not null,
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create unique index if not exists uq_one_decision_per_attention
  on brahma_attention_decisions(attention_request_id);

-- Consequential execution must consume the persisted decision exactly once.
