import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';

class SiteSettings extends Model {
    declare id: number;
    declare site_name: string;
    declare site_logo: string;
    declare favicon: string;
    declare footer_logo: string;
    declare hero_title: string;
    declare hero_description: string;
    declare hero_button_text: string;
    declare product_button_text: string;
    declare combo_button_text: string;
    declare contact_phone: string;
    declare contact_email: string;
    declare contact_address: string;
    declare hero_images: string[];
    declare faqs: { question: string; answer: string }[];
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

SiteSettings.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        site_name: {
            type: DataTypes.STRING(255),
            defaultValue: 'E-Commerce Store',
        },
        site_logo: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        favicon: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        footer_logo: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        hero_title: {
            type: DataTypes.STRING(255),
            defaultValue: 'Elevate Your Everyday.',
        },
        hero_description: {
            type: DataTypes.TEXT,
            defaultValue: 'Discover our premium collection.',
        },
        hero_button_text: {
            type: DataTypes.STRING(100),
            defaultValue: 'Shop Now',
        },
        product_button_text: {
            type: DataTypes.STRING(100),
            defaultValue: 'Order Now',
        },
        combo_button_text: {
            type: DataTypes.STRING(100),
            defaultValue: 'Get This Combo Deal',
        },
        contact_phone: {
            type: DataTypes.STRING(100),
            defaultValue: '+880 1234-567890',
        },
        contact_email: {
            type: DataTypes.STRING(100),
            defaultValue: 'support@example.com',
        },
        contact_address: {
            type: DataTypes.TEXT,
            defaultValue: 'Dhaka, Bangladesh',
        },
        hero_images: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        faqs: {
            type: DataTypes.JSON,
            defaultValue: [], // Array of { question, answer }
        },
    },
    {
        sequelize,
        tableName: 'site_settings',
        timestamps: true,
    }
);

export default SiteSettings;
