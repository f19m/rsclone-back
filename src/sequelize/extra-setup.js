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
    moves.hasMany(tags_arr, { as: 'tags_arr', foreignKey: 'collection' });
    // tags_arr.belongsTo(tags);
    tags_arr.belongsTo(moves, { foreignKey: 'collection' });

    // users.hasMany(moves);

    user_cat.hasMany(moves, { as: 'cat_from_ref', foreignKey: 'cat_from' });
    user_cat.hasMany(moves, { as: 'cat_to_ref', foreignKey: 'cat_to' });

    moves.belongsTo(user_cat, { as: 'cat_from_ref', foreignKey: 'cat_from' });
    moves.belongsTo(user_cat, { as: 'cat_to_ref', foreignKey: 'cat_to' });

    // moves.belongsTo(user_cat, { foreignKey: 'cat_to' });

    // user_cat.hasMany(moves, { as: 'cat_to', foreignKey: 'id' });

    // moves.belongsTo(users);
    // moves.belongsTo(user_cat, { foreignKey: 'id' });
    // moves.belongsTo(user_cat, { foreignKey: 'id' });
}
