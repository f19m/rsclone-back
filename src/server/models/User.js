import sequelize from '../../sequelize';
import UserCategories from './UserCategories';

const { models } = sequelize;

export default class User {
    static async create(userRec) {
        try {
            const user = await models.users.create(userRec);
            await UserCategories.createCustomRecords(user);
            return user;
        } catch (e) {
            console.log(e.message);
            if (e.errno === 19) {
                console.log('#create - 2.1');
                throw new Error(`User with email "${userRec.email}" has aldready exist`);
            } else {
                console.log('#create - 2.2');
                throw new Error(e.message);
            }
        }
    }

    static async findOne(email) {
        try {
            const res = await models.users.findOne({ where: { email } });

            if (!res) return null; // throw new Error(`User with email ${email} not found`);

            return res.dataValues;
        } catch (e) {
            console.log('!Error');
            throw new Error(e.message);
        }
    }

    static async getAll() {
        const users = await models.users.findAll();
        return users;
    }

    get() {
        return { name: this.name, email: this.email, password: this.password };
    }

    async getInfo() {
        return { name: this.name, email: this.email };
    }
}
