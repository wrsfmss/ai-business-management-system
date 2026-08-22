# BRAHMA JARVIS iPad integration

BRAHMA is iPad-compatible as a native SwiftUI client over the FastAPI HTTPS API. The iPad is a presentation/control client; PostgreSQL/Supabase remains authoritative.

## Required API contract

Base URL:

```text
https://<brahma-domain>
```

Health:

```http
GET /readyz
```

Attention decision:

```http
POST /api/v1/attention/{request_id}/decision
Authorization: Bearer <Supabase access token>
Content-Type: application/json

{
  "decision": "approve",
  "idempotency_key": "<uuid>"
}
```

## Client rules

1. Authenticate with the Supabase iOS SDK and obtain the current access token.
2. Send the access token as a Bearer token to BRAHMA.
3. Generate a unique idempotency key per user intent and persist it until the request is acknowledged.
4. Never persist an approval as authoritative local state.
5. On force-close/reopen, reload server state.
6. Use HTTPS in production; do not embed `SUPABASE_SERVICE_ROLE_KEY` or `BRAHMA_DATABASE_URL` in the app.

## Native SwiftUI mapping

The iPad client can model the API as an `actor`-isolated `BRAHMAAPIClient` using `URLSession`, with `AttentionDecision` and server response as `Codable` values. Authentication belongs in the Supabase SDK layer; the API client receives only the short-lived access token.

The current repository does not contain an Xcode project. The server API is ready for the native client, but the final device acceptance gate requires an actual iPad/Xcode build, Supabase account, HTTPS endpoint, and authenticated smoke test.
