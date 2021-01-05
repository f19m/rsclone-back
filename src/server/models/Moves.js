import { Op } from 'sequelize';
import sequelize from '../../sequelize';
import Err from '../../utils/err';
import UserCat from './UserCategories';

const { models } = sequelize;
const offsetSize = 10;

export default class Moves {
    static async getAllUserRecords(user) {
        const res = await models.moves.findAll({
            include: [{ model: models.tags_arr, as: 'tagsArr' }],
            order: [
                ['date', 'DESC'],
                ['id', 'DESC'],
            ],
            where: { user: user.id },
        });
        return res;
    }

    static async getAllUserRecordsByCategory(user, cat) {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> cat');
        console.log(cat);
        const res = await models.moves.findAll({
            include: [{ model: models.tags_arr, as: 'tagsArr' }],
            order: [
                ['date', 'DESC'],
                ['id', 'DESC'],
            ],
            where: {
                [Op.and]: [
                    { user: user.id },
                    {
                        [Op.or]: [
                            { cat_from: cat.id },
                            { cat_to: cat.id },
                        ],
                    },
                ],
            },
        });
        return res;
    }

    static async getUserRecordsWithOffset(user, offset = 0) {
        const res = await models.moves.findAll({
            include: [{ model: models.tags_arr, as: 'tagsArr' }],
            order: [
                ['date', 'DESC'],
                ['id', 'DESC'],
            ],
            where: {
                [Op.and]: [
                    { user: user.id },
                    // {
                    //     date: {
                    //         [Op.gte]: new Date(`${(new Date()).getFullYear()}/${(new Date()).getMonth() + 1}/01`),
                    //     },
                    // },

                ],
            },
            limit: offsetSize,
            offset: offset * offsetSize,
        });
        let newOffset = parseInt(offset, 10);
        newOffset = res.length < offsetSize ? newOffset : newOffset + 1;

        return { data: res, offset: newOffset };
    }

    static async getSumByMonth(userCat) {
        let res = [];
        let ret;

        if (userCat.type === 1 || userCat.type === '1') {
            console.log('#1');
            res = await models.moves.findAll({
                attributes: [
                    'cat_from',
                    [sequelize.fn('sum', sequelize.col('value')), 'total_value'],
                ],
                where: {
                    [Op.and]: [
                        { cat_from: userCat.id },
                        {
                            date: {
                                [Op.gte]: new Date(`${(new Date()).getFullYear()}/${(new Date()).getMonth() + 1}/01`),
                            },
                        },
                    ],
                },
                group: ['cat_from'],
            });

            // ret = res.length ? res[0].total_value : 0;
        } if (userCat.type === 3 || userCat.type === '3') {
            console.log('#2');
            res = await models.moves.findAll({
                attributes: [
                    'cat_to',
                    [sequelize.fn('sum', sequelize.col('value')), 'total_value'],
                ],
                where: {
                    [Op.and]: [
                        { cat_to: userCat.id },
                        {
                            date: {
                                [Op.gte]: new Date(`${(new Date()).getFullYear()}/${(new Date()).getMonth() + 1}/01`),
                            },
                        },
                    ],
                },
                group: ['cat_to'],
            });

            //  ret = res.length ? res[0].dataValues.total_value : 0;
        }

        return res.length ? res[0].dataValues.total_value || 0 : 0;
    }

    static async create({ user, data }) {
        const moveObj = { ...data };
        const tagArr = data.tag_arr;

        console.log('>>>>>>>>>>>>> data MOVE: data');
        console.log(data);

        if (moveObj.tag_arr) delete moveObj.tag_arr;
        moveObj.user = user.id;
        moveObj.date = Date.parse(moveObj.date);

        const catFrom = await UserCat.getCatById(moveObj.cat_from, user);
        const catTo = await UserCat.getCatById(moveObj.cat_to, user);

        console.log('#0');
        if (!((catFrom.type === 1 && catTo.type === 2)
            || (catFrom.type === 2 && catTo.type === 2)
            || (catFrom.type === 2 && catTo.type === 3))) {
            console.log('#PRAGMA');
            throw new Err('Method not implemented for this types of categpries', 500);
        }
        console.log('#a');
        const newMove = await models.moves.create(moveObj);
        const prmTagArr = [];

        console.log('#b');
        tagArr.forEach((tagItem) => {
            console.log('tagItem');
            console.log(tagItem);

            const tagArrObj = {};
            tagArrObj.collection = newMove.id;
            tagArrObj.tag = tagItem.tag;
            prmTagArr.push(models.tags_arr.create(tagArrObj));
        });

        console.log('#с');
        await Promise.all(prmTagArr);

        console.log('#d');
        if (catFrom.type === 2) {
            catFrom.summa -= moveObj.value;
        } else {
            catFrom.summa = await this.getSumByMonth(catFrom);
        }

        if (catTo.type === 2) {
            catTo.summa += moveObj.value;
        } else {
            catTo.summa = await this.getSumByMonth(catTo);
        }

        console.log('#1');
        await UserCat.update(catFrom, user);
        console.log('#2');
        await UserCat.update(catTo, user);
        console.log('#3');
        const res = await models.moves.findByPk(newMove.id, {
            include: [{ model: models.tags_arr, as: 'tagsArr' }],
        });

        console.log('#4');
        return { move: res, cat_from: catFrom, cat_to: catTo };
    }
}
