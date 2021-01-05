import express from 'express';
import userRouter from './users';
import userCatRouter from './userCategories';
import tagsRouter from './tags';
import movesRouter from './moves';
import Err from '../../../utils/err';

import UserCategories from '../../models/UserCategories';

const router = express.Router();
router.use('/', userRouter);
router.use('/', userCatRouter);
router.use('/', tagsRouter);
router.use('/', movesRouter);

router.get('/test', (req, res, next) => {
    console.log('------------------------');
    console.log(req.query);

    UserCategories.getAllData(req.query)
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

router.get('/test2', (req, res, next) => {
    UserCategories.getAllData2(req.query)
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

export default router;
