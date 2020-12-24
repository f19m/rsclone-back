import AppDAO from './dao';

class Repository {
  constructor(dao) {
    this.dao = dao;
  }

  async createTables() {
    try {
      const usersTable = `CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text,
        email text UNIQUE,
        password text,
        CONSTRAINT email_unique UNIQUE (email)
    )`;
      await this.dao.run(usersTable);
    } catch (err) {
      console.log(err.message);
    }

    // категории
    try {
      const cat = `CREATE TABLE cat_type (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text,
      code text,
      CONSTRAINT cat_code UNIQUE (code)
    )`;
      await this.dao.run(cat);
    } catch (err) {
      console.log(err.message);
    }

    // пользовательские категории
    try {
      const userCat = `CREATE TABLE user_cat(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text,
      user INTEGER,
      type INTEGER,
      plan REAL,
      img text,
      summ real,
      CONSTRAINT user_cat_unique UNIQUE (user, type, name),
      FOREIGN KEY(user) REFERENCES users(id),
      FOREIGN KEY(type) REFERENCES cat_type(id)
    )`;
      await this.dao.run(userCat);
    } catch (err) {
      console.log(err.message);
    }

    // tag
    try {
      const tags = `CREATE TABLE tags(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user INTEGER,
        name text,
        FOREIGN KEY(user) REFERENCES users(id)
      )`;
      await this.dao.run(tags);
    } catch (err) {
      console.log(err.message);
    }

    // движения по счетам
    try {
      const moves = `CREATE TABLE moves(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user INTEGER,
        cat_from INTEGER,
        cat_to INTEGER,
        date NUMERIC,
        value REAL,
        FOREIGN KEY(user) REFERENCES users(id),
        FOREIGN KEY(cat_from) REFERENCES user_cat(id),
        FOREIGN KEY(cat_to) REFERENCES user_cat(id)
      )`;
      await this.dao.run(moves);
    } catch (err) {
      console.log(err.message);
    }

    // lables_arr
    try {
      const tagsArr = `CREATE TABLE tags_arr(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            collection INTEGER,
            tag INTEGER,
            FOREIGN KEY(collection) REFERENCES moves(id),
            FOREIGN KEY(tag) REFERENCES tags(id)
          )`;
      await this.dao.run(tagsArr);
    } catch (err) {
      console.log(err.message);
    }
  }
}

const dao = new AppDAO('db.sqlite');

const repo = new Repository(dao);

(async () => {
  await repo.createTables();

  [['Доходы', 'income'], ['Счета', 'accounts'], ['Расходы', 'expenses']]
    .forEach((cat) => {
      const sql = 'INSERT INTO cat_type(name,code) VALUES (?, ?)';
      try {
        repo.dao.run(sql, cat);
      } catch (e) {
        console.log(e.message);
      }
    });
})();

export default repo;
