import sequelize from '../../sequelize';
import UserCategories from './UserCategories';
import Moves from './Moves';
import Categories from './Categories';
import Tags from './Tags';
import Err from '../../utils/err';

const { models } = sequelize;

class User {
    static async create(userRec) {
        try {
            const user = await models.users.create(userRec);
            await UserCategories.createCustomRecords(user);
            return user;
        } catch (e) {
            if (e.original.code === '23505') {
                throw new Err(`User with email ${userRec.email} aldready exist`, 409);
            } else {
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
            // console.log('!Error');
            throw new Error(e.message);
        }
    }

    static async getUserInfo(user) {
        const catTypes = await Categories.getAllRecords();
        const userCatType = await UserCategories.getAllUserRecords(user);
        const movesArr = await Moves.getUserRecordsWithOffset(user);
        const tagsArr = await Tags.getAllRecords(user);
        const movesArrByDay = await Moves.getUserRecordsGroupByDay(user);

        return {
            categories: catTypes,
            user: {
                email: user.email,
                name: user.name,
                userCategories: userCatType,
                moves: movesArr,
                allMoves: movesArrByDay,
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

    static async dataGenerate(userRec) {
        const userCat = await models.user_cat.findAll({ where: { user: userRec.id }, raw: true });
        const catFromArr = userCat.filter((obj) => obj.type === 2);
        const catToArr = userCat.filter((obj) => obj.type === 3);
        const moveArr = [];

        const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const rounded = function (number) {
            return +number.toFixed(2);
        };

        const curDate = new Date();
        let date = curDate - 30 * 1000 * 60 * 60 * 24;
        // console.log(new Date(date));

        while (new Date(date) <= (curDate - 1000 * 60 * 60 * 24)) {
            let movesCnt = Math.floor(Math.random() * 7);
            while (movesCnt === 0) {
                movesCnt = Math.floor(Math.random() * 7);
            }

            const opDate = new Date(date);
            const strOpDate = `${opDate.getFullYear()}-${opDate.getMonth() + 1}-${opDate.getDate()}`;

            // console.log(`strOpDate: ${strOpDate}`);

            for (let index = 0; index < movesCnt; index += 1) {
                // console.log(`move ${index + 1} of ${movesCnt}`);

                const catFrom = getRandomItem(catFromArr);
                const catTo = getRandomItem(catToArr);
                let summ = rounded(Math.random() * 5000);
                while (summ === 0) summ = rounded(Math.random() * 5000);

                const newMove = {
                    user: userRec.id,
                    cat_from: catFrom.id,
                    cat_to: catTo.id,
                    date: strOpDate,
                    value: summ,
                };
                moveArr.push(models.moves.create(newMove));
            }
            date += 1000 * 60 * 60 * 24;
        }

        await Promise.all(moveArr);

        const res = await this.getUserInfo(userRec);
        return res;
    }
}

export default User;
