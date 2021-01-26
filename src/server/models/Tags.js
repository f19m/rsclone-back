import { Op } from 'sequelize';
import sequelize from '../../sequelize';
import Err from '../../utils/err';

const { models } = sequelize;

export default class Tags {
    static model() {
        return models.tags;
    }

    static modelArr() {
        return models.tags_arr;
    }

    static async getAllRecords(user) {
        const data = await models.tags.findAll({ where: { user: user.id } });
        return data;
    }

    static async create({ name, user }) {
        try {
            const data = await models.tags.create({ name, user: user.id });
            return data;
        } catch (e) {
            if (e.original.errno === 19) {
                throw new Err('Duplicate value', 409);
            }
            // console.log(e);
            throw new Error(e);
        }
    }

    static async update({ user, tag }) {
        const data = await models.tags.update({ name: tag.name },
            {
                where: {
                    [Op.and]: [
                        { id: tag.id },
                        { user: user.id },
                    ],
                },

            });
        const res = await this.getCatById(tag.id, user);
        return res;
    }

    static async delete({ user, tag }) {
        const data = await models.tags.destroy({
            where: {
                [Op.and]: [
                    { id: tag.id },
                    { user: user.id },
                ],
            },

        });
        return {};
    }

    static async getCatById(id, user) {
        const dbObj = await models.tags.findOne({
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
}
