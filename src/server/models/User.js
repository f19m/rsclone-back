import sequelize from '../../sequelize';

const { models } = sequelize;

export default class User {
    constructor(userRec) {
        this.name = userRec.name;
        this.email = userRec.email.toLowerCase();
        this.password = userRec.password;

        return this;
    }

    static async create(userRec) {
        console.log(`create userRec = ${JSON.stringify(userRec)}`);

        const user = new User(userRec);
        const userForCreate = user.get();

        console.log(`User create =>${JSON.stringify(userForCreate)}`);

        try {
            await models.users.create(userForCreate);
            return user.getInfo();
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
            return new User(res).get();
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

    getInfo() {
        return { name: this.name, email: this.email };
    }
}
