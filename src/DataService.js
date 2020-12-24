/* eslint-disable class-methods-use-this */
import repo from './repo';

export default class DataService {
  static async getCategories() {
    console.log('DataService.getCategories');
    const sql = 'select * from cat_type whsere id = 5';
    const res = await repo.dao.all(sql);
    console.log(`   res: ${JSON.stringify(res)}`);
    return res;
  }
}
