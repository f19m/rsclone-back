import sqlite3 from 'sqlite3';
import Promise from 'bluebird';

export default class AppDAO {
//   constructor() {
//     this.DBSOURCE = 'db.sqlite';
//     this.db = new sqlite3.Database(this.DBSOURCE, (err) => {
//       if (err) {
//         console.log('#0');
//         console.log(err.message);
//         throw new Error(err);
//       } else {
//         console.log('#Connected to the SQLite database.');
//         this.db.run(`CREATE TABLE users(
//                   id INTEGER PRIMARY KEY AUTOINCREMENT,
//                   name text,
//                   email text UNIQUE,
//                   password text,
//                   CONSTRAINT email_unique UNIQUE (email)
//               )`);
//       }
//     });
//   }

  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database');
      }
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log(`Error running sql ${sql}`);
          console.log(err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log(`Error running sql: ${sql}`);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log(`Error running sql: ${sql}`);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

const dao = new AppDAO('db.sqlite');
