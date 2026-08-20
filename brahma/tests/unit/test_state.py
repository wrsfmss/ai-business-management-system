import pytest

from brahma.backend.domain.state import ExecutionStatus, validate_execution_transition


def test_running_to_verifying_is_allowed() -> None:
    validate_execution_transition(ExecutionStatus.RUNNING, ExecutionStatus.VERIFYING)


def test_completed_is_terminal() -> None:
    with pytest.raises(ValueError):
        validate_execution_transition(ExecutionStatus.COMPLETED, ExecutionStatus.RUNNING)


def test_queued_cannot_complete_directly() -> None:
    with pytest.raises(ValueError):
        validate_execution_transition(ExecutionStatus.QUEUED, ExecutionStatus.COMPLETED)
