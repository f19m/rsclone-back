import { DataTypes } from 'sequelize';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
export default (sequelize) => {
    sequelize.define('tags', {
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
        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['user', 'name'],
            },
        ],
    });
};
