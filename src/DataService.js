/* eslint-disable class-methods-use-this */
import repo from './repo';

export default class DataService {
  static async getCategories() {
    console.log('DataService.getCategories');
    const sql = 'select * from cat_type';
    const res = await repo.dao.all(sql);
    console.log(`   res: ${JSON.stringify(res)}`);
    return res;
  }

  static async getUsers() {
    console.log('DataService.getCategories');
    const sql = 'select * from users';
    const res = await repo.dao.all(sql);
    console.log(`   res: ${JSON.stringify(res)}`);
    return res;
  }
}
