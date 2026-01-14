import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';

class Order extends Model {
    declare id: number;
    declare customer_name: string;
    declare phone: string;
    declare city: string;
    declare address: string;
    declare product_id: number;
    declare product_name_snapshot: string;
    declare price_snapshot: number;
    declare order_status: 'pending' | 'processing' | 'delivered_to_courier' | 'complete' | 'waiting' | 'canceled';
    declare readonly created_at: Date;
    declare readonly updatedAt: Date;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customer_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_name_snapshot: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        price_snapshot: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        order_status: {
            type: DataTypes.ENUM('pending', 'processing', 'delivered_to_courier', 'complete', 'waiting', 'canceled'),
            defaultValue: 'pending',
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updatedAt',
    }
);

export default Order;
