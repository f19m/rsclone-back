/* eslint-disable class-methods-use-this */
import repo from './repo';

export default class UserModel {
  constructor(userRec) {
    this.name = userRec.name;
    this.email = userRec.email.toLowerCase();
    this.password = userRec.password;

    console.log(`UserModel.constructor(name=>${this.name}
      , email=>${this.email}
      , password=>${this.password})`);
    return this;
  }

  static async create(userRec) {
    const usrModel = new UserModel(userRec);

    console.log('#create - 1');
    const insert = 'INSERT INTO users (name,email,password) VALUES (?,?,?)';

    try {
      await repo.dao.run(insert, [usrModel.name, usrModel.email, usrModel.password]);
      return usrModel;
    } catch (e) {
      console.log('#create - 2');
      console.log(Object.keys(e));
      if (e.errno === 19) {
        console.log('#create - 2.1');
        throw new Error(`User with email "${usrModel.email}" has aldready exist`);
      } else {
        console.log('#create - 2.2');
        throw new Error(e.message);
      }
    }

    console.log('#create - 3');
  }

  static async findOne(findObj) {
    console.log(`findOne(findObj=>${JSON.stringify(findObj)})`);

    const select = 'select name,email,password from users where email = ?';

    try {
      const res = await repo.dao.get(select, [findObj.email.toLowerCase()]);
      if (!res) throw new Error(`User with email ${findObj.email} not found`);
      return new UserModel(res);
    } catch (e) {
      console.log('!Error');
      throw new Error(e.message);
    }
  }
}
