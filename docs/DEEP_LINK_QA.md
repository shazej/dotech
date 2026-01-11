# Deep Link QA Checklist

## 1. Payload Compatibility
**Goal:** Ensure backend sends correct data for "Booking" notifications.
- [ ] **Contract:** Payload MUST contain:
  - `type`: One of `BOOKING_CREATED`, `BOOKING_ACCEPTED`, `BOOKING_COMPLETED`, `BOOKING_REJECTED`
  - `bookingId`: Valid UUID string
- [ ] **Test:** Send manual FCM message via Postman/Firebase Console with above data key-values. 
- [ ] **Result:** App logs "Deep Link Handled" (in debug console).

## 2. Customer App Scenarios
### A. Terminated (Cold Start)
- [ ] Kill the app.
- [ ] Send push notification (`type=BOOKING_ACCEPTED`, `bookingId=...`).
- [ ] Tap the notification in system tray.
- [ ] **Expectation:** App launches -> Splash -> Login (if needed) -> **Navigates to Booking Detail**.
- [ ] **Verify:** Detail page shows correct Booking ID.

### B. Background
- [ ] Open app, go to Home, press Home button (app in background).
- [ ] Send push notification.
- [ ] Tap notification.
- [ ] **Expectation:** App comes to foreground -> **Navigates directly to Booking Detail**.

### C. Foreground
- [ ] Open app, stay on Home screen.
- [ ] Send push notification.
- [ ] **Expectation:** Notification banner appears (if configured) or Log shows received. Does NOT auto-navigate (unless designed to). Tapping system banner should navigate.

## 3. Provider App Scenarios
### A. Terminated
- [ ] Kill app.
- [ ] Send push (`type=BOOKING_CREATED`, `bookingId=...`).
- [ ] Tap notification.
- [ ] **Expectation:** App launches -> **Navigates to Job Detail**.

### B. Background
- [ ] App in background.
- [ ] Send push.
- [ ] Tap notification.
- [ ] **Expectation:** App foregrounds -> **Navigates to Job Detail**.

## 4. Edge Cases
- [ ] **Duplicate Taps:** Tap the same notification multiple times rapidly. App should not open multiple detail pages (Dedupe check success).
- [ ] **Missing ID:** Send payload without `bookingId`. App should ignore and log error, not crash.
- [ ] **Invalid ID:** Send payload with non-existent `bookingId`. Detail page should show Error/Retry state.
