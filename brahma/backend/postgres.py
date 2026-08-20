from contextlib import contextmanager

try:
    import psycopg
except ImportError:  # pragma: no cover - exercised by startup tests
    psycopg = None


class PostgresExecutor:
    """Fail-closed executor for BRAHMA's authoritative PostgreSQL RPC."""

    def __init__(self, dsn: str):
        if not dsn:
            raise ValueError("PostgreSQL DSN is required")
        if psycopg is None:
            raise RuntimeError("psycopg is required for live PostgreSQL execution")
        self.dsn = dsn

    def __call__(self, query: str, params: tuple):
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute(query, params)
                row = cur.fetchone()
                conn.commit()
                return row[0] if row else None
