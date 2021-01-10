import express from 'express';
import apiRouter from './api';
import sequelize from '../../sequelize';
import Err from '../../utils/err';

const router = express.Router();

router.get('/cat_type', (req, res) => {
    sequelize.models.cat_type.findAll()
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.get('/user_cat', (req, res) => {
    sequelize.models.user_cat.findAll()
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.get('/moves', (req, res) => {
    sequelize.models.moves.findAll()
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.use('/api', apiRouter);
export default router;
