# Analytics Events Specification

Tracking logic implements `Firebase Analytics`.

## User Properties
- `user_type`: "customer" | "provider"
- `plan_tier`: "free" | "premium" (if applicable)

## Events

| Event Name | Params | Trigger |
| :--- | :--- | :--- |
| `sign_up` | `method` | User registers. |
| `login` | `method` | User logs in. |
| `view_provider` | `provider_id`, `provider_name`, `category` | User opens provider profile. |
| `search` | `term`, `filters_count` | User performs a search. |
| `booking_create` | `service_id`, `provider_id`, `value` | User requests booking. |
| `booking_status_change` | `booking_id`, `status`, `old_status` | Status updates (Accept/Reject/etc). |
| `favorite_add` | `provider_id` | User favorites a provider. |
| `share_app` | `method` | User clicks share in Invite page. |
