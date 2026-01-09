# Appointment Lifecycle & Transitions

## Statuses
- **PENDING**: Initial state when customer requests an appointment.
- **ACCEPTED**: Provider accepted the request.
- **REJECTED**: Provider rejected the request (Reason required).
- **CANCELLED**: Customer or Provider cancelled the appointment (Reason required).
- **COMPLETED**: Service has been delivered.

## Transitions

| From State | To State | Triggered By | Requirement |
| :--- | :--- | :--- | :--- |
| PENDING | ACCEPTED | Provider | None |
| PENDING | REJECTED | Provider | Reason text |
| PENDING | CANCELLED | Customer | Reason text |
| ACCEPTED | CANCELLED | Customer/Provider | Reason text |
| ACCEPTED | COMPLETED | Provider | Completion triggered by end time or manual logic |

## Rules
1. Once **REJECTED** or **CANCELLED** or **COMPLETED**, an appointment cannot change status.
2. Rescheduling creates a NEW state or modifies the `date/time` of the current `PENDING`/`ACCEPTED` appointment without changing valid status.
