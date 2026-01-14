# E-Commerce Landing Website

A full-stack e-commerce website built with Next.js, MySQL, Sequelize ORM, and Tailwind CSS.

## Features

### Public Features
- **Landing Page**: Beautiful, responsive landing page with product showcase
- **Order Form**: Simple order placement with Cash on Delivery (COD)
- **Track Orders**: Phone number-based order tracking (no login required)

### Admin Features
- **Admin Dashboard**: Overview of orders, revenue, and statistics
- **Product Management**: Edit products, manage stock, and toggle visibility
- **Order Management**: Update order status, add notes, and manage orders
- **Site Settings**: Configure site name, hero section, and contact information

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based admin authentication (HTTP-only cookies)

## Prerequisites

- Node.js 18+ installed
- MySQL server running locally or remotely
- npm or yarn package manager

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd c:\Users\Saro\Desktop\Site\Ecom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env.local` file is already configured with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=1234
   DB_NAME=ecom_db
   
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Create the MySQL database**
   
   Open MySQL and run:
   ```sql
   CREATE DATABASE ecom_db;
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Initialize the database**
   
   Open your browser and visit:
   ```
   http://localhost:3000/api/init-db
   ```
   
   This will create all tables and seed default products.

7. **Access the application**
   - **Public Site**: http://localhost:3000
   - **Admin Login**: http://localhost:3000/admin/login
   - **Track Orders**: http://localhost:3000/track-order

## Default Admin Credentials

- **Email**: admin@ecomstore.com
- **Password**: admin123

⚠️ **Important**: Change these credentials in production by logging into the admin panel or directly updating the database.

## Default Products

The system comes with 3 pre-configured products:
1. **Product A** - $29.99
2. **Product B** - $39.99
3. **Combo Product (A + B)** - $59.99

You can edit these products from the admin panel.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── admin/        # Admin authentication
│   │   ├── orders/       # Order management
│   │   ├── products/     # Product management
│   │   ├── settings/     # Site settings
│   │   └── init-db/      # Database initialization
│   ├── admin/            # Admin pages
│   │   ├── dashboard/    # Admin dashboard
│   │   ├── products/     # Product management
│   │   ├── orders/       # Order management
│   │   ├── settings/     # Site settings
│   │   └── login/        # Admin login
│   ├── order/            # Order form page
│   ├── track-order/      # Track order page
│   └── page.tsx          # Landing page
├── components/           # Reusable components
│   └── AdminLayout.tsx   # Admin layout wrapper
├── lib/                  # Utility functions
│   ├── db.ts            # Database connection
│   └── auth.ts          # Authentication utilities
├── models/              # Sequelize models
│   ├── Product.ts       # Product model
│   ├── Order.ts         # Order model
│   ├── SiteSettings.ts  # Settings model
│   └── index.ts         # Model initialization
└── middleware.ts        # Route protection middleware
```

## Key Features Explained

### No User Authentication
- Users can place orders without creating an account
- Order tracking is done using phone number only
- Only admin authentication exists

### Cash on Delivery (COD)
- All orders are COD only
- No payment gateway integration needed
- Customers pay when they receive their order

### Phone-Based Order Tracking
- Customers enter their phone number to track orders
- All orders associated with that phone number are displayed
- Shows order status, timeline, and delivery information

### Admin Panel
- Secure JWT-based authentication
- Manage products (edit, toggle active/inactive)
- Manage orders (update status, add notes)
- Configure site settings (branding, hero section, contact info)

## Deployment

### For Production Hosting

1. **Update environment variables** for production database
2. **Change admin credentials** in `.env.local`
3. **Update JWT_SECRET** to a strong random string
4. **Build the application**:
   ```bash
   npm run build
   ```
5. **Start production server**:
   ```bash
   npm start
   ```

### Database Migration

When deploying to a hosting provider:
1. Create a MySQL database on your hosting
2. Update `.env.local` with production database credentials
3. Visit `/api/init-db` to initialize the database

## API Endpoints

### Public Endpoints
- `GET /api/products?active=true` - Get active products
- `POST /api/orders` - Create new order
- `GET /api/orders?phone={phone}` - Track orders by phone
- `GET /api/settings` - Get site settings

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify admin session
- `PUT /api/products` - Update product
- `PUT /api/orders` - Update order
- `DELETE /api/orders?id={id}` - Delete order
- `PUT /api/settings` - Update site settings

## Customization

### Changing Colors
Edit `app/globals.css` to modify the color scheme and gradients.

### Adding More Products
Use the admin panel to edit existing products or modify the default products in `models/index.ts`.

### Modifying Order Statuses
Order statuses are defined in `models/Order.ts`. Current statuses:
- pending
- confirmed
- shipped
- delivered
- cancelled

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `.env.local`
- Ensure `ecom_db` database exists

### Admin Login Not Working
- Clear browser cookies
- Verify credentials in `.env.local`
- Check if JWT_SECRET is set

### Products Not Showing
- Visit `/api/init-db` to initialize database
- Check if products are marked as active in admin panel

## Support

For issues or questions, check the console logs in the browser and terminal for error messages.

## License

This project is open source and available for personal and commercial use.
