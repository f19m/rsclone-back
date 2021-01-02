import { Op } from 'sequelize';
import sequelize from '../../sequelize';

const { models } = sequelize;

export default class Tags {
    static async getAllRecords(user) {
        const data = await models.tags.findAll({ where: { user: user.id } });
        return data;
    }

    static async create({ name, user }) {
        const data = await models.tags.create({ name, user: user.id });
        return data;
    }

    static async edit({ user, tag }) {
        const data = await models.tags.update({ name: tag.name },
            {
                where: {
                    [Op.and]: [
                        { id: tag.id },
                        { user: user.id },
                    ],
                },

            });
        return data;
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
        return data;
    }
}
