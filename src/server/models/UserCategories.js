import { Op } from 'sequelize';
import sequelize from '../../sequelize';
import defData from './data/usersCat';
import Moves from './Moves';

const { models } = sequelize;

export default class UserCategories {
    static async createCustomRecords(user) {
        Object.keys(defData).forEach((typeCode) => {
            models.cat_type.findOne({ where: { code: typeCode } }).then((type) => {
                defData[typeCode].forEach(async (cur) => {
                    const curObj = { ...cur };
                    curObj.user = user.id;
                    curObj.type = type.id;
                    await models.user_cat.create(curObj);
                });
            });
        });
    }

    static async getCatById(id, user) {
        const dbObj = await models.user_cat.findOne({
            where: {
                [Op.and]: [
                    { id },
                    { user: user.id },
                ],
            },
        });
        const res = dbObj ? dbObj.dataValues : null;
        return res;
    }

    static async getAllUserRecords(user) {
        //  console.log('UserCategories.getAllUserRecords');
        const res = await models.user_cat.findAll({ where: { user: user.id } });

        async function processArray(array) {
            // eslint-disable-next-line no-restricted-syntax
            for (const cat of array) {
                if (cat.type === 1 || cat.type === 3) {
                    const sumByMonth = await Moves.getSumByMonth(cat);
                    cat.summa = sumByMonth;
                }
            }
        }

        await processArray(res);

        return res;
    }

    static async create(catRec, user) {
        const insertObj = { ...catRec };

        insertObj.user = user.id;
        insertObj.summa = insertObj.summa || 0;

        const newRec = await models.user_cat.create(insertObj);
        return newRec;
    }

    static async update(catRec, user) {
        const insertObj = { ...catRec };
        insertObj.user = user.id;

        await models.user_cat.update(insertObj,
            {
                where: {
                    [Op.and]: [
                        { id: insertObj.id },
                        { user: user.id },
                    ],
                },

            });
        const newRec = models.user_cat.findByPk(insertObj.id);
        return newRec;
    }
}
