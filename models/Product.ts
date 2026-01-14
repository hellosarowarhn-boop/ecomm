import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';

class Product extends Model {
    declare id: number;
    declare name: string;
    declare original_price: number;
    declare offer_price: number;
    declare type: 'single' | 'combo';
    declare bottle_quantity: number;
    declare description: string;
    declare images: { url: string; name: string }[];
    declare is_active: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        original_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        offer_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('single', 'combo'),
            allowNull: false,
            defaultValue: 'single',
        },
        bottle_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
            validate: {
                isValidArray(value: any) {
                    if (!Array.isArray(value)) {
                        throw new Error('Images must be an array');
                    }
                    if (value.length > 5) {
                        throw new Error('Maximum 5 images allowed');
                    }
                },
            },
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'products',
        timestamps: true,
    }
);

export default Product;
