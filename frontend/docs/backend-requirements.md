# Required Backend Endpoints (NestJS)

Ensure the following endpoints are implemented to support the frontend features.

## Providers
- `GET /providers`: List providers with filters query params.
- `GET /providers/featured`: Get list of featured providers.
- `GET /providers/:id`: Get full profile details.

## Appointments
- `GET /appointments`: Get current user (customer) appointments.
- `GET /appointments/provider`: Get current user (provider) appointments.
- `GET /appointments/:id`: Get details.
- `POST /appointments`: Create new booking.
- `PATCH /appointments/:id/status`: Update status `(status, reason?)`.

## Business Hours
- `GET /business-hours`: Get provider schedule.
- `POST /business-hours`: Upsert provider schedule.
  - Body: `{ schedule: { monday: { isOpen: boolean, intervals: [{start, end}] } ... } }`

## User/Settings
- `POST /users/fcm-token`: Register FCM device token.
- `PATCH /users/settings/privacy`: Update privacy settings.
