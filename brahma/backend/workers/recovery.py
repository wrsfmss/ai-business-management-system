from dataclasses import dataclass
from datetime import datetime, timedelta, timezone


@dataclass(frozen=True)
class Lease:
    execution_id: str
    worker_id: str
    expires_at: datetime


def lease_expired(lease: Lease, now: datetime | None = None) -> bool:
    now = now or datetime.now(timezone.utc)
    return lease.expires_at <= now


def next_lease(now: datetime | None = None, seconds: int = 30) -> datetime:
    now = now or datetime.now(timezone.utc)
    return now + timedelta(seconds=seconds)


class RecoveryContract:
    """Durability contract for worker leases and checkpoints.

    A concrete adapter must acquire/renew leases transactionally and recover
    only expired executions. Recovery resumes from the latest committed
    checkpoint using the original execution/idempotency identity.
    """

    @staticmethod
    def should_recover(lease: Lease, now: datetime | None = None) -> bool:
        return lease_expired(lease, now)
