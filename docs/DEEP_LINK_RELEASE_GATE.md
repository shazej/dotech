# Deep Link & Push Notification Release Gate

**Date:** 2026-01-11
**Evaluated By:** Antigravity (AI Assistant) & [USER TO SIGN]
**Status:** ⚠️ Pending Physical Verification

## 1. Backend Payload Contract Code Verification (Passed)
Audit of `bookings.service.ts` confirms the following payloads:

| Event | Code Location | Data Keys Verified |
| :--- | :--- | :--- |
| **Booking Created** | `create()` (Line 59) | `{ type: 'BOOKING_CREATED', bookingId: savedBooking.id }` |
| **Booking Accepted** | `accept()` (Line 90) | `{ type: 'BOOKING_ACCEPTED', bookingId: savedBooking.id }` |
| **Booking Completed** | `updateStatus()` (Line 141) | `{ type: 'BOOKING_COMPLETED', bookingId: booking.id }` |
| **Booking Rejected** | `updateStatus()` (Line 148) | `{ type: 'BOOKING_REJECTED', bookingId: booking.id }` |

**Conclusion:** Backend code guarantees `type` and `bookingId` presence for all critical flows.

## 2. Simulator Verification (Logically Verified)
Verified via simulated deep link trigger in `main.dart` and code inspection:

### Android
- [x] **Trigger:** Simulated `BOOKING_ACCEPTED` payload via `NotificationService.handleMessage`.
- [x] **Navigation:** Application handled navigation to `/booking_detail` (Logic path exercised).
- [x] **Deduplication:** Rapid duplicate message was correctly ignored/deduplicated.
- [x] **Wait Loop:** Logic correctly queues navigation if `navigatorKey` is not ready.

### iOS
- [x] **Build:** Successfully built and launched `customer_app` and `provider_app` on iOS 16.0 Simulator.
- [x] **Logic:** Shared Dart logic with Android. Verified `Firebase.initializeApp()` is called correctly.
- [x] **Deep Link:** Validated via simulated trigger (same as Android) during build process.

## 3. Physical QA Checklist (To Be Filled By User)

### Device 1: _____________________ (e.g., Pixel 7, Android 13)
- [ ] **Terminated Deep Link:** Tapping push launches app & opens detail.
- [ ] **Background Deep Link:** Tapping push foregrounds app & opens detail.
- [ ] **Deduplication:** Rapid taps on same notification result in single navigation.
- [ ] **Invalid ID:** Tapping push with bad ID shows error screen (not crash).

### Device 2: _____________________ (e.g., iPhone 14, iOS 16)
- [ ] **Terminated Deep Link:** Tapping push launches app & opens detail.
- [ ] **Background Deep Link:** Tapping push foregrounds app & opens detail.
- [ ] **Deduplication:** Rapid taps on same notification result in single navigation.
- [ ] **Invalid ID:** Tapping push with bad ID shows error screen (not crash).

## 4. Known Issues / Limitations
- **Foreground Handling:** Current implementation defaults to logging for foreground messages. It does *not* auto-navigate. Use system banner.
- **Navigator Race Condition:** A loop `while (navigatorKey.currentState == null)` protects cold starts.
- **iOS Simulator:** Deep links must be simulated via code or CLI (xcrun simctl push) due to APNs limitations. Not fully representative of APNs delivery path.

## 5. Final Recommendation
**READY FOR QA:** The code logic is sound and verified via simulation for both platforms.
**NOT READY FOR PRODUCTION:** Until physical verification (Section 3) is marked PASS.
