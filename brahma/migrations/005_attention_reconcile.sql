-- Atomic attention decision + execution resume boundary.
-- The application must call this function inside the authoritative DB.
create or replace function brahma_decide_attention(
  p_request_id uuid,
  p_actor_id uuid,
  p_decision text,
  p_idempotency_key text
) returns jsonb
language plpgsql
as $$
declare
  existing jsonb;
  req brahma_attention_requests%rowtype;
  result jsonb;
begin
  select result into existing from brahma_idempotency_keys where key = p_idempotency_key for update;
  if existing is not null then return existing; end if;

  select * into req from brahma_attention_requests where id = p_request_id for update;
  if not found then raise exception 'attention request not found'; end if;
  if req.status <> 'pending' then raise exception 'attention request is no longer pending'; end if;
  if p_decision not in ('approve','reject','defer','expire','cancel') then raise exception 'invalid decision'; end if;

  insert into brahma_attention_decisions(attention_request_id, actor_id, decision, idempotency_key)
  values (p_request_id, p_actor_id, p_decision, p_idempotency_key);

  update brahma_attention_requests
     set status = case p_decision
       when 'approve' then 'approved'
       when 'reject' then 'rejected'
       when 'defer' then 'deferred'
       when 'expire' then 'expired'
       else 'cancelled' end,
         decision_data = jsonb_build_object('actor_id', p_actor_id, 'decision', p_decision),
         decided_at = now()
   where id = p_request_id;

  insert into brahma_audit_events(execution_id, event_type, event_data)
  values (req.execution_id, 'attention_decision', jsonb_build_object(
    'request_id', p_request_id, 'actor_id', p_actor_id, 'decision', p_decision));

  result := jsonb_build_object('request_id', p_request_id, 'decision', p_decision, 'status', 'recorded');
  insert into brahma_idempotency_keys(key, operation, result)
  values (p_idempotency_key, 'attention_decision', result);
  return result;
end;
$$;
