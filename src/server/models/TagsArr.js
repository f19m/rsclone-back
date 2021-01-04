import { Op } from 'sequelize';
import sequelize from '../../sequelize';

const { models } = sequelize;

export default class TagsArr {
    /// ПЕРЕДЕЛАТЬ
    static async getAllRecords(user) {
        const data = await models.tags_arr.findAll({ where: { user: user.id } });
        return data;
    }

    static async create({ tag, moves }) {
        const data = await models.tags_arr.create({ collection: moves.id, tag: tag.id });
        return data;
    }

    static async delete({ tag, moves }) {
        const data = await models.tags_arr.destroy({
            where: {
                [Op.and]: [
                    { collection: moves.id },
                    { tag: tag.id },
                ],
            },

        });
        return data;
    }
}
