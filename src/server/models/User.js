import sequelize from '../../sequelize';
import UserCategories from './UserCategories';
import Moves from './Moves';
import Categories from './Categories';
import Tags from './Tags';

const { models } = sequelize;

class User {
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

            if (!res) return null;
            return res.dataValues;
        } catch (e) {
            console.log('!Error');
            throw new Error(e.message);
        }
    }

    static async getUserInfo(user) {
        const catTypes = await Categories.getAllRecords();
        const userCatType = await UserCategories.getAllUserRecords(user);
        const movesArr = await Moves.getUserRecordsWithOffset(user);
        const tagsArr = await Tags.getAllRecords(user);

        return {
            categories: catTypes,
            user: {
                email: user.email,
                name: user.name,
                userCategories: userCatType,
                moves: movesArr,
                tags: tagsArr,
            },
        };
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

export default User;
