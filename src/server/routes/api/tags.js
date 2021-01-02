import express from 'express';
import mid from '../../middleware';
import Err from '../../../utils/err';
import Tags from '../../models/Tags';
import schema from '../../schemaValidator';

const router = express.Router();
const {
    auth, attachCurrentUser, validate,
} = mid;

router.use('/tags', router);

router.post('/get', auth.required, attachCurrentUser, (req, res, next) => {
    console.log('get');
    Tags.getAllUserRecords(req.currentUser)
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

router.post('/create', auth.required, attachCurrentUser, validate({ body: schema.tags.create }), (req, res, next) => {
    console.log('>>>>>>>   set:   req.body');

    const tagName = req.body.name;
    const user = req.currentUser;

    Tags.create({ name: tagName, user })
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

router.post('/update', auth.required, attachCurrentUser, validate({ body: schema.tags.update }), (req, res, next) => {
    console.log(`>>>>>>>   categories/update${req.body}`);

    const tagRec = req.body;
    const user = req.currentUser;

    Tags.update({ tag: tagRec, user })
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

router.post('/delete', auth.required, attachCurrentUser, validate({ body: schema.tags.delete }), (req, res, next) => {
    console.log(`>>>>>>>   categories/update${req.body}`);

    const tag = req.body;
    const user = req.currentUser;

    Tags.update({ tag, user })
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

export default router;
