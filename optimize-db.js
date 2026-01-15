const mysql = require('mysql2/promise');

async function optimizeDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'ecom_db'
        });

        console.log('🔧 Starting database optimization...\n');

        // Add indexes to orders table for faster queries
        const indexes = [
            {
                name: 'idx_order_status',
                table: 'orders',
                column: 'order_status',
                query: 'CREATE INDEX IF NOT EXISTS idx_order_status ON orders(order_status)'
            },
            {
                name: 'idx_phone',
                table: 'orders',
                column: 'phone',
                query: 'CREATE INDEX IF NOT EXISTS idx_phone ON orders(phone)'
            },
            {
                name: 'idx_created_at',
                table: 'orders',
                column: 'created_at',
                query: 'CREATE INDEX IF NOT EXISTS idx_created_at ON orders(created_at)'
            },
            {
                name: 'idx_status_created',
                table: 'orders',
                column: 'order_status, created_at',
                query: 'CREATE INDEX IF NOT EXISTS idx_status_created ON orders(order_status, created_at)'
            }
        ];

        for (const index of indexes) {
            try {
                await connection.execute(index.query);
                console.log(`✅ Created index: ${index.name} on ${index.table}(${index.column})`);
            } catch (error) {
                if (error.code === 'ER_DUP_KEYNAME') {
                    console.log(`ℹ️  Index ${index.name} already exists`);
                } else {
                    console.error(`❌ Error creating index ${index.name}:`, error.message);
                }
            }
        }

        // Analyze tables for better query optimization
        console.log('\n📊 Analyzing tables...');
        await connection.execute('ANALYZE TABLE orders');
        console.log('✅ Orders table analyzed');

        await connection.execute('ANALYZE TABLE products');
        console.log('✅ Products table analyzed');

        await connection.end();

        console.log('\n🎉 Database optimization complete!');
        console.log('\n📈 Performance improvements:');
        console.log('   • Faster order filtering by status');
        console.log('   • Faster phone number searches');
        console.log('   • Faster date-based sorting');
        console.log('   • Optimized combined status + date queries');

    } catch (error) {
        console.error('❌ Database optimization failed:', error);
        process.exit(1);
    }
}

optimizeDatabase();
