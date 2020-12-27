import sequelize from './index';

export default {
    userModel: sequelize.models.users,
    userCategoriesModel: sequelize.models.user_cat,
    categoriesModel: sequelize.models.cat_type,
    movesModel: sequelize.models.oves,
    tagsModel: sequelize.models.tags,
    tagArrModel: sequelize.models.tags_arr,
};
