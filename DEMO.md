# Dotech End-to-End Demo Script

**Goal**: Demonstrate the complete lifecycle of a service booking from Customer to Provider.

## 1. Start Dependencies (Infrastructure)
Ensure your database and cache are running.
```bash
# Start Postgres & Redis
make up
```

## 2. Verify Health (Doctor)
Run the doctor script to check connections and view Mobile URLs.
```bash
make doctor
```

## 3. Start Backend
Open a new terminal tab:
```bash
make dev-backend
```
*Wait until you see: "Nest application successfully started"*

## 4. Search Data (Seed)
Populate the database with idempotent demo data.
```bash
make db-seed
```
*Expected Output: "🎉 Idempotent Seed Complete!"*

## 5. Start Mobile Apps
**Note**: The apps automatically detect the correct API URL (Android `10.0.2.2`, iOS `localhost`).

**Android Emulator:**
```bash
cd customer_app
flutter run
# Select Android Emulator if prompted
```

**iOS Simulator:**
```bash
cd provider_app
flutter run
# Select iOS Simulator if prompted
```

## 6. Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@dotech.com` | `password123` |
| **Customer** | `customer1@dotech.com` | `password123` |
| **Provider (Cleaner)** | `provider1@dotech.com` | `password123` |
| **Provider (Plumber)** | `provider2@dotech.com` | `password123` |

## 7. Demo Flow (Click-Path)

### Scenario: "John needs a house cleaning"

#### Step 1: Customer (Mobile App)
1. **Login**: Use `customer1@dotech.com`.
2. **Browse**: Tap on "Cleaning" category.
3. **Select Service**: Choose "Standard John Cleaner" ($50).
4. **Book**: Select tomorrow's date and confirm.
5. **Verify**: Go to "My Bookings" tab -> Status should be `PENDING`.

#### Step 2: Provider (Mobile App)
*Run Provider App on a different simulator or device*
1. **Login**: Use `provider1@dotech.com` (John Cleaner).
2. **Dashboard**: You should see a new **Pending Request**.
3. **Action**: Tap the booking and click **Accept**.
4. **Update Status**: 
   - Click "Start Job" when "Arrived".
   - Click "Complete Job" when done.
5. **Verify**: Booking status changes to `COMPLETED`.

#### Step 3: Admin (Web Portal - Optional)
1. **Login**: `admin@dotech.com`.
2. **View**: Check Dashboard stats (Revenue should reflect the completed job).

## 8. Troubleshooting
- **Seed Fails**: Ensure backend is running (`make dev-backend`). check logs.
- **Mobile Network Error**: 
  - Android: Ensure you are using the emulator (10.0.2.2 is hardcoded for it).
  - iOS: Ensure backend is on port 3000.

## 9. Evidence (Proof of Run)
This repository includes a `demo_artifacts/` folder for verifying the demo run.

### Architecture Proof
- `doctor_output.txt`: Output of `make doctor`.
- `seed_output.txt`: Output of `make db-seed`.
- `smoke_test.txt`: Output of `make test-smoke`.

### Mobile Proof
To generate mobile proof:
1. Run Android Emulator → Take Screenshot → Save as `demo_artifacts/android_demo.png`
2. Run iOS Simulator → Take Screenshot → Save as `demo_artifacts/ios_demo.png`
