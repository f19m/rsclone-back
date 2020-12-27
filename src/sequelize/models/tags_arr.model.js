import { DataTypes } from 'sequelize';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
export default (sequelize) => {
    sequelize.define('tags_arr', {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        collection: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        tag: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },

    });
};
