import { Op } from 'sequelize';
import sequelize from '../../sequelize';

const { models } = sequelize;
const offsetSize = 10;

export default class Moves {
    static async getAllUserRecords(user) {
        const res = await models.moves.findAll({ where: { user: user.id } });
        return res;
    }

    static async getUserRecordsWithOffset(user, offset = 0) {
        const res = await models.moves.findAll({
            where: {
                [Op.and]: [
                    { user: user.id },
                    {
                        date: {
                            [Op.gte]: new Date(`${(new Date()).getFullYear()}/${(new Date()).getMonth() + 1}/01`),
                        },
                    },
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
}
