import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';

class Admin extends Model {
    declare id: number;
    declare email: string;
    declare password: string;
    declare name: string;
    declare role: 'super_admin' | 'co_admin';
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Admin.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('super_admin', 'co_admin'),
            allowNull: false,
            defaultValue: 'super_admin',
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'admins',
        timestamps: true,
    }
);

export default Admin;
