# State Machines

## Task

```text
created -> planned -> running -> completed
                         |-> waiting_attention
                         |-> failed
                         |-> cancelled
                         `-> blocked
```

## Execution

```text
queued -> running -> verifying -> completed
             |           |-> failed
             |           `-> running
             |-> paused -> running
             |-> waiting_attention -> running
             |-> failed
             `-> cancelled
```

Terminal states are immutable except through an explicitly versioned recovery/administrative procedure.

## Attention request

```text
pending -> approved
        -> rejected
        -> deferred
        -> expired
        -> cancelled
        -> superseded
```

Every transition has an authenticated actor and an idempotency key. Stale or duplicate decisions cannot create a second consequential action.
