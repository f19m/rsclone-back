import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import Err from '../utils/err';

const app = express();
// const isProd = process.env.NODE_ENV === 'production'
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(routes);
app.use(router);

// catch 404
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json(new Err(err.message));
});

export default app;
