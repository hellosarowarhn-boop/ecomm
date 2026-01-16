import Admin from './Admin';
import Product from './Product';
import Order from './Order';
import SiteSettings from './SiteSettings';
import sequelize from '../lib/db';
import bcrypt from 'bcryptjs';

export const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('All models synchronized successfully.');

        // Initialize default admin if none exist
        const adminCount = await Admin.count();
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await Admin.create({
                email: 'admin@ecomstore.com',
                password: hashedPassword,
                name: 'Super Admin',
                role: 'super_admin',
            });
            console.log('Default admin created: admin@ecomstore.com / admin123');
        }

        // Initialize default products if none exist
        const productCount = await Product.count();
        if (productCount === 0) {
            await Product.bulkCreate([
                {
                    name: 'Product A',
                    original_price: 39.99,
                    offer_price: 29.99,
                    type: 'single',
                    bottle_quantity: 1,
                    description: 'Experience the premium quality of Product A. Carefully selected ingredients ensuring the best results for your daily needs. Long-lasting and effective.',
                    images: [],
                    is_active: true,
                },
                {
                    name: 'Product B',
                    original_price: 49.99,
                    offer_price: 39.99,
                    type: 'single',
                    bottle_quantity: 1,
                    description: 'Product B offers exceptional value and performance. Designed for those who appreciate quality and reliability. A perfect addition to your collection.',
                    images: [],
                    is_active: true,
                },
                {
                    name: 'Combo Product (A + B)',
                    original_price: 89.99,
                    offer_price: 59.99,
                    type: 'combo',
                    bottle_quantity: 2,
                    description: 'Get the best of both worlds with our exclusive Combo Pack. Includes Product A and Product B at an unbeatable price. Limited time offer!',
                    images: [],
                    is_active: true,
                },
            ]);
            console.log('Default products created.');
        }

        // Initialize site settings if none exist
        const settingsCount = await SiteSettings.count();
        if (settingsCount === 0) {
            await SiteSettings.create({
                site_name: 'E-Commerce Store',
                site_logo: '',
                favicon: '',
            });
            console.log('Default site settings created.');
        }

        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        // THROW the error so the API route can catch and display it
        throw error;
    }
};

export { Admin, Product, Order, SiteSettings, sequelize };
