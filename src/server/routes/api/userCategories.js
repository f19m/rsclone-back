import express from 'express';
import mid from '../../middleware';
import Err from '../../../utils/err';
import UserCategories from '../../models/UserCategories';
import schema from '../../schemaValidator';

const router = express.Router();
const {
    auth, attachCurrentUser, validate,
} = mid;

router.use('/categories', router);

router.post('/get', auth.required, attachCurrentUser, (req, res) => {
    UserCategories.getAllUserRecords(req.currentUser)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/create', auth.required, attachCurrentUser, validate({ body: schema.categories.create }), (req, res) => {
    const catRec = req.body;
    const user = req.currentUser;

    UserCategories.create(catRec, user)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/update', auth.required, attachCurrentUser, validate({ body: schema.categories.update }), (req, res) => {
    const catRec = req.body;
    const user = req.currentUser;

    UserCategories.update(catRec, user)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

export default router;
