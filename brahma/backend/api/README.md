# FastAPI application wiring contract

The production application must mount the attention route at:

`POST /api/v1/attention/{request_id}/decision`

Required request JSON:

```json
{"decision":"approve","idempotency_key":"<client-generated-key>"}
```

Required authentication boundary:

- validate the bearer session with the configured authentication provider;
- derive `actor_id` from the verified session;
- never accept `actor_id` from request JSON;
- load the attention request from PostgreSQL;
- execute `brahma_decide_attention(...)` in the same authoritative database;
- return the persisted result.

The route must map validation/authentication failures to 4xx responses and database/concurrency failures to an appropriate 5xx response. It must not acknowledge an approval before the database transaction commits.

This document is an integration contract; it is not evidence that the live FastAPI process has been wired or executed.
