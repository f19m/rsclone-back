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

router.post('/get', auth.required, attachCurrentUser, (req, res) => {
    Tags.getAllRecords(req.currentUser)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/create', auth.required, attachCurrentUser, (req, res) => {
    const tagName = req.body.name;
    const user = req.currentUser;

    Tags.create({ name: tagName, user })
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/update', auth.required, attachCurrentUser, (req, res) => {
    const { tag } = req.body;
    const user = req.currentUser;

    Tags.update({ tag, user })
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/delete', auth.required, attachCurrentUser, (req, res) => {
    const { tag } = req.body;
    const user = req.currentUser;

    Tags.update({ tag, user })
        .then(() => res.redirect(307, '/api/user/getInfo'))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.get('/getAllTags', (req, res) => {
    Tags.model().findAll()
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.get('/getAllTagsArr', (req, res) => {
    Tags.modelArr().findAll()
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});
export default router;
