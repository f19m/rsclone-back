import { DataTypes } from 'sequelize';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
export default (sequelize) => {
    sequelize.define('moves', {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        user: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: sequelize.models.users,
                key: 'id',
            },
        },
        cat_from: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: sequelize.models.user_cat,
                key: 'id',
            },
        },
        cat_to: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: sequelize.models.user_cat,
                key: 'id',
            },
        },
        date: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        value: {
            allowNull: false,
            type: DataTypes.DECIMAL(10, 2),
        },
        comment: {
            allowNull: true,
            type: DataTypes.STRING,
        },

    });
};
