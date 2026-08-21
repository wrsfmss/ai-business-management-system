import os

import psycopg


def test_ci_can_reach_postgres() -> None:
    dsn = os.environ["BRAHMA_DATABASE_URL"]
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute("select 1")
            assert cur.fetchone() == (1,)
