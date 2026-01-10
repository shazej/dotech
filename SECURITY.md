# Dotech Security Architecture

## 1. Authentication Model
Dotech uses **JWT (JSON Web Tokens)** for stateless authentication.
- **Access Tokens**: Short-lived (15m - 1h), signed with `JWT_SECRET`.
- **Refresh Tokens**: Long-lived, stored securely (HTTP-only cookies recommended for web, SecureStorage for mobile).

## 2. Authorization & Roles
Role-Based Access Control (RBAC) is enforced via NestJS Guards (`RolesGuard`).

### Defined Roles
1. **Admin**: Full access to all resources.
2. **Provider**: Access to own profile, services, and bookings assigned to them.
3. **Customer**: Access to own profile and creating bookings.

### Role Enforcement (Audit)
- **Providers** cannot access Admin endpoints.
- **Customers** cannot access Provider-only endpoints (e.g., accepting bookings).
- **Public** endpoints are explicitly whitelisted (e.g., Auth, Public Service Listings).

## 3. Infrastructure Security
- **Database**: Not exposed publicly. Accessed only via Backend.
- **Redis**: Protected by network isolation (Docker network) or password (Production).
- **Secrets**: Managed via `.env` files. **NEVER** commit `.env` to version control.

## 4. Mobile Security
- **API Communication**: All traffic over HTTPS (in production).
- **Storage**: Sensitive data (Tokens) stored in `FlutterSecureStorage`.
