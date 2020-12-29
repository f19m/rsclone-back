export default function applyExtraSetup(sequelize) {
    const {
        cat_type, moves, tags_arr, tags, user_cat, users,
    } = sequelize.models;

    // users.hasMany(user_cat);
    // user_cat.belongsTo(users);

    // cat_type.hasMany(user_cat);
    // user_cat.belongsTo(cat_type);

    // users.hasMany(tags);
    // tags.belongsTo(users);

    // tags.hasMany(tags_arr);
    // moves.hasMany(tags_arr);
    // tags_arr.belongsTo(tags);
    // tags_arr.belongsTo(moves);

    // users.hasMany(moves);
    // user_cat.hasMany(moves, { as: 'cat_from', foreignKey: 'id' });
    // user_cat.hasMany(moves, { as: 'cat_to', foreignKey: 'id' });

    // moves.belongsTo(users);
    // moves.belongsTo(user_cat, { foreignKey: 'id' });
    // moves.belongsTo(user_cat, { foreignKey: 'id' });
}
