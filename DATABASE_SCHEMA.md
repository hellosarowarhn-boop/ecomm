# Database Schema Documentation

## Overview
This document describes the MySQL database schema for the E-Commerce application using Sequelize ORM.

## Tables

### 1. admins
Stores admin user credentials for authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique admin ID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Admin email address |
| password | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| createdAt | DATETIME | NOT NULL | Record creation timestamp |
| updatedAt | DATETIME | NOT NULL | Record update timestamp |

**Default Admin:**
- Email: `admin@ecomstore.com`
- Password: `admin123` (hashed with bcrypt)

---

### 2. products
Stores product information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique product ID |
| name | VARCHAR(255) | NOT NULL | Product name |
| original_price | DECIMAL(10,2) | NOT NULL | Original price before discount |
| offer_price | DECIMAL(10,2) | NOT NULL | Discounted/offer price |
| type | ENUM('single', 'combo') | NOT NULL, DEFAULT 'single' | Product type |
| bottle_quantity | INTEGER | NOT NULL, DEFAULT 1 | Number of bottles in product |
| images | JSON | NULL, DEFAULT [] | Array of image URLs (max 5) |
| is_active | BOOLEAN | DEFAULT true | Product visibility status |
| createdAt | DATETIME | NOT NULL | Record creation timestamp |
| updatedAt | DATETIME | NOT NULL | Record update timestamp |

**Validations:**
- `images` must be an array
- Maximum 5 images allowed per product

**Default Products:**
1. Product A (single, 1 bottle, $39.99 → $29.99)
2. Product B (single, 1 bottle, $49.99 → $39.99)
3. Combo Product (combo, 2 bottles, $89.99 → $59.99)

---

### 3. orders
Stores customer orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique order ID |
| customer_name | VARCHAR(255) | NOT NULL | Customer full name |
| phone | VARCHAR(20) | NOT NULL | Customer phone number |
| city | VARCHAR(100) | NOT NULL | Delivery city |
| address | TEXT | NOT NULL | Full delivery address |
| product_id | INTEGER | NOT NULL | Reference to product ID |
| product_name_snapshot | VARCHAR(255) | NOT NULL | Product name at order time |
| price_snapshot | DECIMAL(10,2) | NOT NULL | Product price at order time |
| order_status | ENUM | DEFAULT 'pending' | Current order status |
| created_at | DATETIME | NOT NULL, DEFAULT NOW | Order creation timestamp |
| updatedAt | DATETIME | NOT NULL | Record update timestamp |

**Order Status Values:**
- `pending` - Order placed, awaiting confirmation
- `processing` - Order confirmed and being prepared
- `delivered_to_courier` - Order handed to delivery service
- `complete` - Order successfully delivered
- `waiting` - Order on hold
- `canceled` - Order canceled

**Note:** Product name and price are stored as snapshots to preserve historical data even if product details change.

---

### 4. site_settings
Stores global site configuration (single row).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique settings ID |
| site_name | VARCHAR(255) | DEFAULT 'E-Commerce Store' | Website name |
| site_logo | VARCHAR(500) | NULL | URL to site logo image |
| favicon | VARCHAR(500) | NULL | URL to favicon image |
| createdAt | DATETIME | NOT NULL | Record creation timestamp |
| updatedAt | DATETIME | NOT NULL | Record update timestamp |

**Default Settings:**
- Site Name: "E-Commerce Store"
- Site Logo: empty (can be set via admin panel)
- Favicon: empty (can be set via admin panel)

---

## Relationships

### No Foreign Key Constraints
The schema intentionally avoids foreign key constraints for flexibility:
- `orders.product_id` references `products.id` but is not enforced
- Product snapshots ensure order data integrity even if products are deleted

---

## Indexes

### Automatic Indexes
- Primary keys (id) on all tables
- Unique index on `admins.email`

### Recommended Additional Indexes
For better query performance, consider adding:
```sql
-- Index for order tracking by phone
CREATE INDEX idx_orders_phone ON orders(phone);

-- Index for filtering active products
CREATE INDEX idx_products_active ON products(is_active);

-- Index for order status filtering
CREATE INDEX idx_orders_status ON orders(order_status);

-- Index for order date sorting
CREATE INDEX idx_orders_created ON orders(created_at);
```

---

## Data Types

### JSON Column (images)
The `products.images` column uses JSON type to store an array of image URLs:
```json
[
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg"
]
```

### ENUM Columns
- `products.type`: 'single' | 'combo'
- `orders.order_status`: 'pending' | 'processing' | 'delivered_to_courier' | 'complete' | 'waiting' | 'canceled'

---

## Security

### Password Hashing
Admin passwords are hashed using bcrypt with salt rounds = 10:
```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```

### Authentication
- JWT tokens with 7-day expiration
- HTTP-only cookies for token storage
- Token secret stored in environment variable

---

## Database Initialization

The database is automatically initialized on first run:

1. **Create Tables**: All tables are created with `sequelize.sync({ alter: true })`
2. **Seed Default Admin**: If no admin exists, creates default admin
3. **Seed Default Products**: If no products exist, creates 3 default products
4. **Seed Default Settings**: If no settings exist, creates default site settings

**Initialization Endpoint:**
```
GET http://localhost:3000/api/init-db
```

---

## Migration Notes

### From Development to Production

1. **Backup Data**: Always backup before migration
2. **Update Environment**: Change database credentials in `.env.local`
3. **Run Initialization**: Visit `/api/init-db` on production server
4. **Change Admin Password**: Update admin password via database or admin panel
5. **Update JWT Secret**: Use a strong random string for production

### Schema Updates

The application uses `sequelize.sync({ alter: true })` which automatically:
- Creates new tables
- Adds new columns
- Modifies column types

**Warning:** This may cause data loss. For production, use Sequelize migrations instead.

---

## Example Queries

### Get All Active Products
```sql
SELECT * FROM products WHERE is_active = true;
```

### Track Orders by Phone
```sql
SELECT * FROM orders WHERE phone = '+1234567890' ORDER BY created_at DESC;
```

### Get Pending Orders
```sql
SELECT * FROM orders WHERE order_status = 'pending';
```

### Calculate Total Revenue
```sql
SELECT SUM(price_snapshot) as total_revenue FROM orders WHERE order_status = 'complete';
```

---

## Maintenance

### Regular Tasks
1. **Clean Old Orders**: Archive or delete old completed orders
2. **Optimize Tables**: Run `OPTIMIZE TABLE` periodically
3. **Backup Database**: Regular automated backups
4. **Monitor Size**: Check database size and clean up if needed

### Performance Optimization
- Add indexes based on query patterns
- Consider partitioning `orders` table by date for large datasets
- Use connection pooling (already configured in Sequelize)

---

## Connection Configuration

Current Sequelize configuration:
```typescript
{
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,        // Maximum connections
    min: 0,        // Minimum connections
    acquire: 30000, // Max time to get connection (ms)
    idle: 10000    // Max idle time before release (ms)
  }
}
```
