import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';

const app = express();
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(routes);
app.use(router);

export default app;
