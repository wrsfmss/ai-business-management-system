import os

import psycopg
import pytest


@pytest.mark.integration
def test_attention_contract_can_connect_to_real_postgres() -> None:
    dsn = os.environ["BRAHMA_DATABASE_URL"]
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute("select to_regprocedure('brahma_decide_attention(text,text,text)')")
            assert cur.fetchone()[0] is not None
