import { DataTypes } from 'sequelize';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
export default (sequelize) => {
    sequelize.define('user_cat', {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        user: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: sequelize.models.users,
                key: 'id',
            },
        },
        type: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: sequelize.models.cat_type,
                key: 'id',
            },
        },
        plan: {
            allowNull: true,
            type: DataTypes.DECIMAL(10, 2),
        },
        summa: {
            allowNull: false,
            type: DataTypes.DECIMAL(10, 2),
        },
        icoUrl: {
            allowNull: false,
            type: DataTypes.STRING,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['user', 'type', 'name'],
            },
        ],
    });
};
