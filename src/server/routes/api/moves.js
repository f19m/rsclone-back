import express from 'express';
import mid from '../../middleware';
import Err from '../../../utils/err';
import Moves from '../../models/Moves';
import schema from '../../schemaValidator';

const router = express.Router();
const {
    auth, attachCurrentUser, validate,
} = mid;

router.use('/moves', router);

router.post('/get', auth.required, attachCurrentUser, (req, res, next) => {
    console.log('/moves/get');
    const offset = req.currentUser.body.offset || 0;

    Moves.getUserRecordsWithOffset(req.currentUser, offset)
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

router.post('/getAll', auth.required, attachCurrentUser, (req, res, next) => {
    console.log('/moves/getAll');

    Moves.getAllUserRecords(req.currentUser)
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

router.post('/getByCategory', auth.required, attachCurrentUser, (req, res, next) => {
    console.log('/moves/getByCategory');
    const { category } = req.body;

    Moves.getAllUserRecordsByCategory(req.currentUser, category)
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

router.post('/create', auth.required, attachCurrentUser, (req, res, next) => {
    console.log('/moves/ >>>>>>>   set:   req.body');

    const moveData = req.body.move;
    const user = req.currentUser;

    Moves.create({ data: moveData, user })
        .then((data) => res.json(data))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

export default router;
