# AXIS PRIME exclusion gate

BRAHMA JARVIS is a standalone runtime.

The following are prohibited from the BRAHMA tree:

- AXIS PRIME imports
- AXIS PRIME environment variables
- AXIS PRIME service dependencies
- AXIS PRIME database tables or foreign keys
- AXIS PRIME deployment references
- AXIS PRIME runtime configuration

CI should fail if these identifiers are introduced into BRAHMA source, migrations, infrastructure, or tests.

This document is a design constraint, not evidence that the exclusion test is already implemented. The exclusion CI check is a Phase 5 acceptance item.
