import sequelize from '../../sequelize';
import defData from './data/usersCat';

const { models } = sequelize;

export default class UserCategories {
    static async createCustomRecords(user) {
        Object.keys(defData).forEach((typeCode) => {
            console.log(`UserCategories.createCustomRecords : typeCode = ${typeCode}`);

            models.cat_type.findOne({ where: { code: typeCode } }).then((type) => {
                defData[typeCode].forEach(async (cur) => {
                    const curObj = { ...cur };
                    curObj.user = user.id;
                    curObj.type = type.id;
                    const res = await models.user_cat.create(curObj);
                    console.log(`add data: ${JSON.stringify(res)}`);
                });
            });
        });
    }

    static async getAllUserRecords(user) {
        const res = await models.user_cat.findAll({ where: { user: user.id } });
        return res;
    }
}
