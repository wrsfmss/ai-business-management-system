-- Atomic execution reconciliation for BRAHMA Phase 5.8.
-- The function performs the state transition, event, audit and idempotency
-- reservation in one transaction. PostgreSQL rolls the entire function call
-- back if an error occurs.

create or replace function brahma_reconcile_execution(
  p_execution_id uuid,
  p_idempotency_key text,
  p_target_status text,
  p_event_type text,
  p_event_data jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing jsonb;
  v_current text;
  v_result jsonb;
begin
  select result into v_existing
    from brahma_idempotency_keys
   where key = p_idempotency_key
   for share;

  if v_existing is not null then
    return v_existing;
  end if;

  select status into v_current
    from brahma_executions
   where id = p_execution_id
   for update;

  if v_current is null then
    raise exception 'execution_not_found';
  end if;

  if not (
    (v_current = 'queued' and p_target_status in ('running','cancelled')) or
    (v_current = 'running' and p_target_status in ('paused','waiting_attention','verifying','failed','cancelled')) or
    (v_current = 'paused' and p_target_status in ('running','cancelled')) or
    (v_current = 'waiting_attention' and p_target_status in ('running','cancelled')) or
    (v_current = 'verifying' and p_target_status in ('completed','running','failed'))
  ) then
    raise exception 'illegal_execution_transition:% -> %', v_current, p_target_status;
  end if;

  update brahma_executions
     set status = p_target_status,
         updated_at = now()
   where id = p_execution_id;

  insert into brahma_execution_events(execution_id, event_type, event_data)
  values (p_execution_id, p_event_type, coalesce(p_event_data, '{}'::jsonb));

  insert into brahma_audit_events(execution_id, event_type, event_data)
  values (p_execution_id, p_event_type, coalesce(p_event_data, '{}'::jsonb));

  v_result := jsonb_build_object(
    'execution_id', p_execution_id,
    'status', p_target_status,
    'idempotency_key', p_idempotency_key
  );

  insert into brahma_idempotency_keys(key, operation, result)
  values (p_idempotency_key, 'reconcile_execution', v_result);

  return v_result;
end;
$$;
