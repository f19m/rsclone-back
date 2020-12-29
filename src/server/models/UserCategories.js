import { Op } from 'sequelize';
import sequelize from '../../sequelize';
import defData from './data/usersCat';
import Moves from './Moves';

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
        //  console.log('UserCategories.getAllUserRecords');
        const res = await models.user_cat.findAll({ where: { user: user.id } });
        async function processArray(array) {
            // eslint-disable-next-line no-restricted-syntax
            for (const cat of array) {
                if (cat.type === 1 || cat.type === 3) {
                    const sumByMonth = await Moves.getSumByMonth(cat);
                    cat.summa = sumByMonth;
                    console.log(`user.name:${user.name};  cat.name: ${cat.name};  summa:${sumByMonth}`);
                }
            }
            console.log(` DONE `);
        }

        await processArray(res);

        console.log(`      return res:${JSON.stringify(res)}`);
        return res;
    }

    static async getAllData(obj) {
        console.log(`from: ${JSON.stringify(obj.from)}to: ${JSON.stringify(obj.to)}`);
        const res = await models.user_cat.findAll({
            limit: 10,
        });

        const fromObj = await models.user_cat.findOne({ where: { type: 2 } });
        const toObj = await models.user_cat.findOne({ where: { type: 3 } });

        const fromId = obj.from || fromObj.id;
        const toId = obj.to || toObj.id;

        await models.moves.create({
            user: 1, cat_from: fromId, cat_to: toId, date: (new Date()), value: 100, comment: 'test',
        });

        return res;
    }

    static async getAllData2(obj) {
        const { offset } = obj;

        const res = await models.user_cat.findAll({
            limit: 3,
            offset: parseInt(offset, 10) * 3,
        });

        let newOffset = parseInt(offset, 10);
        newOffset = res.length < 3 ? newOffset : newOffset + 1;
        return { data: res, offset: newOffset };
    }

    static async create(catRec, user) {
        const insertObj = { ...catRec };

        insertObj.user = user.id;
        insertObj.summa = insertObj.summa || 0;

        const newRec = await models.user_cat.create(insertObj);
        return newRec;
    }

    static async update(catRec, user) {
        console.log(`update data1: ${JSON.stringify(catRec)}`);
        const insertObj = { ...catRec };

        insertObj.user = user.id;

        console.log(`update data2: ${JSON.stringify(insertObj)}`);
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
