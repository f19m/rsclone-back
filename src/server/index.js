import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import router from './routes';
import Err from '../utils/err';
import mid from './middleware';
// const isProd = process.env.NODE_ENV === 'production'
// app.use(cors());

import swaggerDocument from '../../readme/f19m-rsclone-back-1.0.0-resolved.json';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(routes);
app.use(router);

app.use('/', (req, res, next) => {
    res.redirect('/api-docs');
});

// catch 404
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // console.log(err.stack);

    if (err instanceof mid.ValidationError) {
        // At this point you can execute your error handling code
        res.status(400).send(new Err('Invalid data input'));
    } else {
        res.status(err.status || 500);
        res.json(new Err(err.message));
    }
});

// CORS EXAMPLE
// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// app.get('/products/:id', cors(corsOptions), function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
// })

export default app;
