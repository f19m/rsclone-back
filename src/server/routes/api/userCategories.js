import express from 'express';
import mid from '../../middleware';
import User from '../../models/User';
import Err from '../../../utils/err';
import UserCategories from '../../models/UserCategories';
import schema from '../../schemaValidator';

const router = express.Router();
const {
    auth, attachCurrentUser, validate,
} = mid;

router.use('/categories', router);

router.post('/get', auth.required, attachCurrentUser, (req, res, next) => {
    console.log('get');
    UserCategories.getAllUserRecords(req.currentUser)
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

router.post('/create', auth.required, attachCurrentUser, validate({ body: schema.categories.create }), (req, res, next) => {
    console.log('>>>>>>>   set:   req.body');

    const catRec = req.body;
    const user = req.currentUser;

    UserCategories.create(catRec, user)
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

router.post('/update', auth.required, attachCurrentUser, validate({ body: schema.categories.update }), (req, res, next) => {
    console.log(`>>>>>>>   categories/update${req.body}`);

    const catRec = req.body;
    const user = req.currentUser;

    UserCategories.update(catRec, user)
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

export default router;
