// Database initialization script
const { initDb } = require('./models/index.ts');

async function initialize() {
    console.log('Starting database initialization...');
    try {
        const result = await initDb();
        if (result) {
            console.log('✅ Database initialized successfully!');
            console.log('✅ Tables created');
            console.log('✅ Default admin created: admin@ecomstore.com / admin123');
            console.log('✅ Default products created');
            console.log('✅ Default settings created');
            process.exit(0);
        } else {
            console.error('❌ Database initialization failed');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

initialize();
