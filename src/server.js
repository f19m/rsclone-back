/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import AuthService from './AuthService';
import isAuth from './isAuth';
import attachCurrentUser from './attachCurrentUser';
import DataService from './DataService';
//
const app = express();

// Server port
const HTTP_PORT = process.env.PORT || 80

// Start server
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

let counter = 0;

async function f() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('готово!'), 1000);
  });

  const result = await promise; // будет ждать, пока промис не выполнится (*)

  return (counter % 2) ? Promise.resolve(result) : Promise.reject('error');
}

// Root endpoint
app.get('/', (req, res, next) => {
  res.json({ "greeting":"Hello Word" })
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/createUser', (req, res, next) => {
  const err = [];
  console.log(`req.body.password = ${req.body.password}`);
  console.log(`req.body.email = ${req.body.email}`);
  console.log(`req.body.name = ${req.body.name}`);

  if (!req.body.password) {
    err.push('No password specified');
  }
  if (!req.body.email) {
    err.push('No email specified');
  }
  if (err.length) {
    res.status(400).json({ error: err.join(',') });
    return;
  }

  (async () => {
    try {
      const user = await AuthService.signUp(req.body.email, req.body.password, req.body.name);
      res.json(JSON.stringify(user));
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e.message });
    }
  })();
});

app.post('/api/login', (req, res, next) => {
  const err = [];
  if (!req.body.email) {
    err.push('No email specified');
  }
  if (!req.body.password) {
    err.push('No password specified');
  }

  if (err.length) {
    res.status(400).json({ error: err.join(',') });
  } else {
    (async () => {
      try {
        const user = await AuthService.login(req.body.email, req.body.password);
        res.json(JSON.stringify(user));
      } catch (e) {
        console.log(e);
        res.status(400).json({ error: e.message });
      }
    })();
  }
});

app.post('/api/categories', isAuth, attachCurrentUser, (req, res) => {
  // const user = req.currentUser;

  DataService.getCategories()
    .then((data) => {
      console.log('then');
      return res.json(data).status(200);
    })
    .catch((err) => {
      console.log('err');
      return res.json(err.message).status(500);
    });

  // try {
  //   const data = await DataService.getCategories();
  //   console.log(`/api/categories data=${JSON.stringify(data)}`);

  // } catch (err) {
  //   return res.json(err.message).status(500);
  // }
});

// Default response for any other request
app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});
