import { Op, QueryTypes } from 'sequelize';
import sequelize from '../../sequelize';
import Err from '../../utils/err';
import UserCat from './UserCategories';
import Tags from './Tags';

const { models } = sequelize;
const offsetSize = 10;

export default class Moves {
    static model() {
        return models;
    }

    static async getAllUserRecords(user) {
        const res = await models.moves.findAll({
            include: [{ model: models.tags_arr, as: 'tags_arr' },
                { model: models.user_cat, as: 'cat_from_ref' },
                { model: models.user_cat, as: 'cat_to_ref' },
            ],
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
            include: [{ model: models.tags_arr, as: 'tags_arr' }],
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
            include: [{ model: models.tags_arr, as: 'tags_arr' }],
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

    static async getSumByMonth(userCatRec) {
        let res = [];

        if (userCatRec.type === 1 || userCatRec.type === '1') {
            res = await models.moves.findAll({
                attributes: [
                    'cat_from',
                    [sequelize.fn('sum', sequelize.col('value')), 'total_value'],
                ],
                where: {
                    [Op.and]: [
                        { cat_from: userCatRec.id },
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
        } if (userCatRec.type === 3 || userCatRec.type === '3') {
            res = await models.moves.findAll({
                attributes: [
                    'cat_to',
                    [sequelize.fn('sum', sequelize.col('value')), 'total_value'],
                ],
                where: {
                    [Op.and]: [
                        { cat_to: userCatRec.id },
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
        const tagArr = data.tags_arr;

        if (moveObj.tags_arr) delete moveObj.tags_arr;
        moveObj.user = user.id;
        moveObj.date = Date.parse(moveObj.date);

        const catFrom = await UserCat.getCatById(moveObj.cat_from, user);
        const catTo = await UserCat.getCatById(moveObj.cat_to, user);
        console.log(catTo);

        if (!((catFrom.type === 1 && catTo.type === 2)
            || (catFrom.type === 2 && catTo.type === 2)
            || (catFrom.type === 2 && catTo.type === 3))) {
            throw new Err('Method not implemented for this types of categpries', 500);
        }

        const newMove = await models.moves.create(moveObj);

        // проверм, что тут нужные ID тэгов
        const tagArrCheck = [];
        tagArr.forEach((tagItem) => {
            tagArrCheck.push(
                Tags.getCatById(tagItem.tag, user).then((tagData) => {
                    if (!tagData) throw new Err('Tag dont finde for current user', 404);
                }),
            );
        });

        await Promise.all(tagArrCheck);

        // создание массива тэгов для записи
        const prmTagArr = [];
        tagArr.forEach((tagItem) => {
            const tagArrObj = {};
            tagArrObj.collection = newMove.id;
            tagArrObj.tag = tagItem.tag;
            prmTagArr.push(models.tags_arr.create(tagArrObj));
        });
        await Promise.all(prmTagArr);

        if (catFrom.type === 2) {
            const sum = parseFloat(catFrom.summa, 10) - parseFloat(moveObj.value, 10);
            catFrom.summa = sum;
        } else {
            catFrom.summa = await this.getSumByMonth(catFrom);
        }
        if (catTo.type === 2) {
            const sum = parseFloat(catTo.summa, 10) + parseFloat(moveObj.value, 10);
            catTo.summa = sum;
        } else {
            catTo.summa = await this.getSumByMonth(catTo);
        }
        console.log(catTo);
        await UserCat.update(catFrom, user);
        await UserCat.update(catTo, user);
        const res = await models.moves.findByPk(newMove.id, {
            include: [{ model: models.tags_arr, as: 'tags_arr' }],
        });

        return { move: res, cat_from: catFrom, cat_to: catTo };
    }

    static async delete(moveRec, user) {
        const delObj = { ...moveRec };
        const move = await models.moves.findByPk(moveRec.id);

        if (!move || move.user !== user.id) {
            throw new Err('Move dont finde for current user', 404);
        }

        delObj.cat_from = move.cat_from;
        delObj.cat_to = move.cat_to;
        delObj.value = move.value;

        const catFrom = await UserCat.getCatById(delObj.cat_from, user);
        const catTo = await UserCat.getCatById(delObj.cat_to, user);

        await models.moves.destroy({
            where: {
                [Op.and]: [
                    { id: delObj.id },
                    { user: user.id },
                ],
            },

        });

        if (catFrom.type === 2) {
            const sum = parseFloat(catFrom.summa, 10) + parseFloat(delObj.value, 10);
            catFrom.summa = sum;
        } else {
            catFrom.summa = await this.getSumByMonth(catFrom);
        }
        if (catTo.type === 2) {
            const sum = parseFloat(catTo.summa, 10) - parseFloat(delObj.value, 10);
            catTo.summa = sum;
        } else {
            catTo.summa = await this.getSumByMonth(catTo);
        }

        await UserCat.update(catFrom, user);
        await UserCat.update(catTo, user);

        return { move: null, cat_from: catFrom, cat_to: catTo };
    }

    static async update(moveRec, user) {
        const updateObj = { ...moveRec };
        const move = await models.moves.findByPk(moveRec.id);

        if (!move || move.user !== user.id) {
            throw new Err('Move dont finde for current user', 404);
        }

        const catFrom = await UserCat.getCatById(move.cat_from, user);
        const catTo = await UserCat.getCatById(move.cat_to, user);

        await models.moves.update({
            value: updateObj.value ? updateObj.value : move.value,
            date: updateObj.date ? updateObj.date : move.date,
            comment: updateObj.comment ? updateObj.comment : move.comment,
        },
        {
            where: {
                [Op.and]: [
                    { id: updateObj.id },
                    { user: user.id },
                ],
            },

        });

        // чистим тэги
        await models.tags_arr.destroy({
            where: { collection: updateObj.id },
        });

        // проверяем текущие теги
        const tagArr = updateObj.tags_arr;
        const tagArrCheck = [];
        tagArr.forEach((tagItem) => {
            tagArrCheck.push(
                Tags.getCatById(tagItem.tag, user).then((tagData) => {
                    if (!tagData) throw new Err('Tag dont finde for current user', 404);
                }),
            );
        });

        await Promise.all(tagArrCheck);

        // создание массива тэгов для записи
        const prmTagArr = [];
        tagArr.forEach((tagItem) => {
            const tagArrObj = {};
            tagArrObj.collection = updateObj.id;
            tagArrObj.tag = tagItem.tag;
            prmTagArr.push(models.tags_arr.create(tagArrObj));
        });
        await Promise.all(prmTagArr);

        if (catFrom.type === 2) {
            const sum = parseFloat(catFrom.summa, 10)
            + parseFloat(move.value, 10) - parseFloat(updateObj.value, 10);
            catFrom.summa = sum;
        } else {
            catFrom.summa = await this.getSumByMonth(catFrom);
        }
        if (catTo.type === 2) {
            const sum = parseFloat(catTo.summa, 10)
            - parseFloat(move.value, 10) + parseFloat(updateObj.value, 10);
            catTo.summa = sum;
        } else {
            catTo.summa = await this.getSumByMonth(catTo);
        }

        await UserCat.update(catFrom, user);
        await UserCat.update(catTo, user);
        const res = await models.moves.findByPk(updateObj.id, {
            include: [{ model: models.tags_arr, as: 'tags_arr' }],
        });
        return { move: res, cat_from: catFrom, cat_to: catTo };
    }

    static async getDataByCatType(filter, user) {
        console.log(filter);
        const records = await sequelize.query(
            `select t.id, date_trunc('${filter.dateTrunc}',m.date) date, sum(m.value) sum
            from moves m, user_cats cf, cat_types t
            where cf.type = t.id
            and ((t.id = 3 and cf.id = m.cat_to) or 
            (t.id = 1 and cf.id = m.cat_from) )
            and (${filter.dateFrom ? `'${filter.dateFrom}'` : 'null'} is not null and m.date >= TO_TIMESTAMP('${filter.dateFrom}', 'YYYY-MM-DD')
                or ${filter.dateFrom ? `'${filter.dateFrom}'` : 'null'} is null)
            and(${filter.dateTo ? `'${filter.dateTo}'` : 'null'} is not null and  m.date <= TO_TIMESTAMP('${filter.dateTo}', 'YYYY-MM-DD') 
             or ${filter.dateTo ? `'${filter.dateTo}'` : 'null'} is null)
            and t.id = ${filter.catType}
            group by t.id, date_trunc('${filter.dateTrunc}',m.date)`, {
                type: QueryTypes.SELECT,
            },
        );

        return records;
    }
}
