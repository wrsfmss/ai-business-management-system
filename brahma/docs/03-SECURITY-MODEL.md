# Security Model

## Trust boundaries

- iPad: untrusted client; holds session credentials only.
- FastAPI: authenticated control plane and policy enforcement point.
- Provider/MCP credentials: server-side only.
- PostgreSQL/Supabase: authoritative durable state.
- LLM output: untrusted data; never an authorization source.

## Capability tiers

- Low: read/search operations.
- Medium: reversible writes.
- High: external communications or consequential writes.
- Critical: financial, destructive or irreversible operations.

Policy determines whether a capability can execute automatically, requires approval, or is forbidden.

## Audit

Important transitions record actor, execution, capability, policy version, idempotency key, outcome and timestamp.

## Secrets

Never place provider secrets, Supabase service-role credentials or MCP credentials in the iPad application. Rotate and revoke credentials through the deployment secret manager.

## AXIS PRIME

CI must reject runtime references. The BRAHMA deployment must contain no AXIS PRIME service, environment variable, import, database dependency or executable.
