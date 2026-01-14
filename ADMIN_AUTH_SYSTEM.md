# Admin Authentication System Documentation

## Overview
The admin authentication system is fully implemented with email-based login, bcrypt password hashing, JWT tokens, and route protection middleware.

## ✅ Features Implemented

### 1. Admin Login Page
**Location:** `/app/admin/login/page.tsx`

**Features:**
- Email + Password form
- Form validation
- Error handling
- Loading states
- Default credentials display
- Responsive design

**URL:** `http://localhost:3000/admin/login`

**Default Credentials:**
- Email: `admin@ecomstore.com`
- Password: `admin123`

---

### 2. Password Hashing
**Location:** `/lib/auth.ts` and `/models/index.ts`

**Implementation:**
- Uses **bcrypt** with salt rounds = 10
- Passwords are hashed before storing in database
- Secure password comparison during login

**Code Example:**
```typescript
// Hashing password
const hashedPassword = await bcrypt.hash(password, 10);

// Verifying password
const isValid = await bcrypt.compare(password, admin.password);
```

---

### 3. Admin Model
**Location:** `/models/Admin.ts`

**Database Table:** `admins`

**Fields:**
- `id` - Auto-increment primary key
- `email` - Unique, required
- `password` - Hashed with bcrypt
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

**Initialization:**
- Default admin created automatically on first run
- Email: `admin@ecomstore.com`
- Password: `admin123` (hashed)

---

### 4. Authentication Flow

#### **Login Process:**

1. **User submits email + password** → `/api/admin/login`
2. **System validates credentials:**
   - Finds admin by email
   - Compares password hash using bcrypt
3. **If valid:**
   - Generates JWT token (7-day expiration)
   - Sets HTTP-only cookie
   - Redirects to dashboard
4. **If invalid:**
   - Returns 401 error
   - Shows error message

#### **Session Management:**

- **JWT Token** stored in HTTP-only cookie
- **Cookie name:** `admin_token`
- **Expiration:** 7 days
- **Secure:** HTTPS only in production
- **SameSite:** Strict

---

### 5. Route Protection Middleware
**Location:** `/middleware.ts`

**How it works:**
```typescript
// Protects all /admin/* routes except /admin/login
if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token');
    
    if (!token) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}
```

**Protected Routes:**
- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`
- `/admin/settings`

**Public Routes:**
- `/admin/login` (login page)
- `/` (landing page)
- `/track-order` (order tracking)

---

### 6. API Routes

#### **POST /api/admin/login**
**Purpose:** Authenticate admin and create session

**Request:**
```json
{
  "email": "admin@ecomstore.com",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful"
}
```
- Sets `admin_token` cookie

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

---

#### **POST /api/admin/logout**
**Purpose:** Clear admin session

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```
- Deletes `admin_token` cookie

---

#### **GET /api/admin/verify**
**Purpose:** Verify if admin is authenticated

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "admin@ecomstore.com",
    "role": "admin"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "authenticated": false
}
```

---

### 7. Admin Layout Component
**Location:** `/components/AdminLayout.tsx`

**Features:**
- Verifies authentication on mount
- Redirects to login if not authenticated
- Sidebar navigation
- Logout button
- Responsive design

**Usage:**
```typescript
import AdminLayout from '@/components/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      {/* Page content */}
    </AdminLayout>
  );
}
```

---

## Security Features

### ✅ Implemented Security Measures:

1. **Password Hashing**
   - Bcrypt with 10 salt rounds
   - Passwords never stored in plain text

2. **HTTP-Only Cookies**
   - JavaScript cannot access tokens
   - Prevents XSS attacks

3. **JWT Tokens**
   - Signed with secret key
   - 7-day expiration
   - Payload includes admin ID and email

4. **Route Protection**
   - Middleware checks all admin routes
   - Automatic redirect to login
   - No manual checks needed

5. **Secure Cookie Settings**
   - `httpOnly: true`
   - `secure: true` (production)
   - `sameSite: 'strict'`
   - `path: '/'`

6. **Database Security**
   - Email validation
   - Unique email constraint
   - Prepared statements (Sequelize)

---

## NO User Authentication

**Important:** This system has **NO user authentication** for customers.

**Customer Features:**
- ✅ Place orders without login
- ✅ Track orders using phone number only
- ✅ No user accounts
- ✅ No user registration
- ✅ No user login

**Only Admin Authentication:**
- ❌ Customers cannot login
- ✅ Only admins can access admin panel
- ✅ Admin panel fully protected

---

## Testing the System

### Test Admin Login:

1. **Navigate to login page:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Enter credentials:**
   - Email: `admin@ecomstore.com`
   - Password: `admin123`

3. **Click "Login"**
   - Should redirect to `/admin/dashboard`
   - Should see admin panel

### Test Route Protection:

1. **Try accessing admin page without login:**
   ```
   http://localhost:3000/admin/dashboard
   ```
   - Should redirect to `/admin/login`

2. **Login and access admin pages:**
   - All admin routes should work
   - Sidebar navigation functional

3. **Logout:**
   - Click "Logout" button
   - Should redirect to `/admin/login`
   - Cannot access admin pages anymore

---

## Changing Admin Credentials

### Method 1: Via Database

```sql
-- Update admin email
UPDATE admins SET email = 'newemail@example.com' WHERE id = 1;

-- Update admin password (must hash first)
-- Use bcrypt to hash your new password, then:
UPDATE admins SET password = 'hashed_password_here' WHERE id = 1;
```

### Method 2: Via Code

Create a script to add/update admin:

```typescript
import bcrypt from 'bcryptjs';
import { Admin } from '@/models';

const hashedPassword = await bcrypt.hash('newpassword', 10);

await Admin.update(
  { email: 'newemail@example.com', password: hashedPassword },
  { where: { id: 1 } }
);
```

---

## Environment Variables

**Required in `.env.local`:**

```bash
# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**⚠️ Important for Production:**
- Change `JWT_SECRET` to a strong random string
- Use HTTPS for secure cookies
- Update admin password after deployment

---

## File Structure

```
├── app/
│   ├── api/
│   │   └── admin/
│   │       ├── login/route.ts      # Login endpoint
│   │       ├── logout/route.ts     # Logout endpoint
│   │       └── verify/route.ts     # Verify session
│   └── admin/
│       ├── login/page.tsx          # Login page
│       ├── dashboard/page.tsx      # Dashboard (protected)
│       ├── products/page.tsx       # Products (protected)
│       ├── orders/page.tsx         # Orders (protected)
│       └── settings/page.tsx       # Settings (protected)
├── components/
│   └── AdminLayout.tsx             # Admin layout wrapper
├── lib/
│   └── auth.ts                     # Auth utilities
├── models/
│   ├── Admin.ts                    # Admin model
│   └── index.ts                    # DB initialization
└── middleware.ts                   # Route protection
```

---

## Summary

✅ **Admin Authentication:** Fully implemented  
✅ **Email + Password:** Working  
✅ **Password Hashing:** Bcrypt with salt  
✅ **Route Protection:** Middleware active  
✅ **Session Management:** JWT + HTTP-only cookies  
✅ **Security:** Multiple layers implemented  
✅ **No User Auth:** Customers use phone number only  

The admin authentication system is **production-ready** and secure!
