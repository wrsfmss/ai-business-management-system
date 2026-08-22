from enum import StrEnum


class TaskStatus(StrEnum):
    CREATED = "created"
    PLANNED = "planned"
    RUNNING = "running"
    WAITING_ATTENTION = "waiting_attention"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    BLOCKED = "blocked"


class ExecutionStatus(StrEnum):
    QUEUED = "queued"
    RUNNING = "running"
    PAUSED = "paused"
    WAITING_ATTENTION = "waiting_attention"
    VERIFYING = "verifying"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


_ALLOWED_EXECUTION_TRANSITIONS: dict[ExecutionStatus, set[ExecutionStatus]] = {
    ExecutionStatus.QUEUED: {ExecutionStatus.RUNNING, ExecutionStatus.CANCELLED},
    ExecutionStatus.RUNNING: {
        ExecutionStatus.PAUSED,
        ExecutionStatus.WAITING_ATTENTION,
        ExecutionStatus.VERIFYING,
        ExecutionStatus.FAILED,
        ExecutionStatus.CANCELLED,
    },
    ExecutionStatus.PAUSED: {ExecutionStatus.RUNNING, ExecutionStatus.CANCELLED},
    ExecutionStatus.WAITING_ATTENTION: {ExecutionStatus.RUNNING, ExecutionStatus.CANCELLED},
    ExecutionStatus.VERIFYING: {
        ExecutionStatus.COMPLETED,
        ExecutionStatus.RUNNING,
        ExecutionStatus.FAILED,
    },
    ExecutionStatus.COMPLETED: set(),
    ExecutionStatus.FAILED: set(),
    ExecutionStatus.CANCELLED: set(),
}


def validate_execution_transition(current: ExecutionStatus, target: ExecutionStatus) -> None:
    if target not in _ALLOWED_EXECUTION_TRANSITIONS[current]:
        raise ValueError(f"Illegal execution transition: {current} -> {target}")
