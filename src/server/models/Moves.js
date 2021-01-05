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

        if (moveObj.tag_arr) delete moveObj.tag_arr;
        moveObj.user = user.id;
        moveObj.date = Date.parse(moveObj.date);

        const catFrom = await UserCat.getCatById(moveObj.cat_from, user);
        const catTo = await UserCat.getCatById(moveObj.cat_to, user);

        if (!((catFrom.type === 1 && catTo.type === 2)
            || (catFrom.type === 2 && catTo.type === 2)
            || (catFrom.type === 2 && catTo.type === 3))) {
            throw new Err('Method not implemented for this types of categpries', 500);
        }

        const newMove = await models.moves.create(moveObj);
        const prmTagArr = [];

        tagArr.forEach((tagItem) => {
            const tagArrObj = {};
            tagArrObj.collection = newMove.id;
            tagArrObj.tag = tagItem.tag;
            prmTagArr.push(models.tags_arr.create(tagArrObj));
        });
        await Promise.all(prmTagArr);

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

        await UserCat.update(catFrom, user);
        await UserCat.update(catTo, user);
        const res = await models.moves.findByPk(newMove.id, {
            include: [{ model: models.tags_arr, as: 'tagsArr' }],
        });

        return { move: res, cat_from: catFrom, cat_to: catTo };
    }
}
