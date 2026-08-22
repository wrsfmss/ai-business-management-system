# iPad Operating Model

The iPad is the human command centre, not the autonomous server.

## Primary views

- Chat — conversation with JARVIS.
- Missions — active, scheduled and completed work.
- Needs You — durable attention requests.
- Activity — execution/audit summaries.
- Memory — user-visible retained information where applicable.

## Reconnection

WebSocket provides live updates but is not authoritative. After reconnect or app restart, the client authenticates and synchronises from server state. Missed events are recovered by state reconciliation.

## Force-close acceptance

1. Start a mission.
2. Persist an attention request.
3. Force-close the iPad app.
4. Leave the server running.
5. Reopen and authenticate.
6. Verify the exact pending attention request is restored.
7. Submit an approval.
8. Verify exactly one state transition and one consequential execution.

## Offline behaviour

Safe server-side work may continue while the iPad is offline. Work requiring human attention pauses durably until a decision is received.
