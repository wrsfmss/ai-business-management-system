from dataclasses import dataclass
from typing import Protocol

from brahma.backend.domain.state import ExecutionStatus, validate_execution_transition


class Transaction(Protocol):
    async def execute(self, query: str, *args: object) -> object: ...


@dataclass(frozen=True)
class ReconciliationCommand:
    execution_id: str
    idempotency_key: str
    target_status: ExecutionStatus
    event_type: str
    event_data: dict


class ReconciliationService:
    """Application-level contract for atomic execution reconciliation.

    The concrete DB adapter must execute the read/transition/event/idempotency
    operations in one PostgreSQL transaction. No external side effect belongs
    inside this transaction.
    """

    def __init__(self, db: Transaction) -> None:
        self.db = db

    async def reconcile(self, command: ReconciliationCommand) -> object:
        # The DB adapter must lock the execution row, validate its current state,
        # reserve the idempotency key, write the transition and audit event, then
        # commit atomically. Replays return the previously stored result.
        return await self.db.execute(
            "SELECT brahma_reconcile_execution($1,$2,$3,$4,$5)",
            command.execution_id,
            command.idempotency_key,
            command.target_status.value,
            command.event_type,
            command.event_data,
        )
