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

router.post('/get', auth.required, attachCurrentUser, (req, res) => {
    const offset = req.currentUser.body.offset || 0;

    Moves.getUserRecordsWithOffset(req.currentUser, offset)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/getAll', auth.required, attachCurrentUser, (req, res) => {
    Moves.getAllUserRecords(req.currentUser)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/getByCategory', auth.required, attachCurrentUser, (req, res) => {
    const { category } = req.body;

    Moves.getAllUserRecordsByCategory(req.currentUser, category)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/create', auth.required, attachCurrentUser, (req, res) => {
    const moveData = req.body.move;
    const user = req.currentUser;

    Moves.create({ data: moveData, user })
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/delete', auth.required, attachCurrentUser, (req, res) => {
    const moveData = req.body.move;
    const user = req.currentUser;

    Moves.delete(moveData, user)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.get('/getAllMoves', (req, res) => {
    Moves.model().moves.findAll({ include: [{ model: Moves.model().tags_arr, as: 'tags_arr' }] })
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/update', auth.required, attachCurrentUser, (req, res) => {
    const { move } = req.body;
    const user = req.currentUser;

    Moves.update(move, user)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/getDataByCatType', auth.required, attachCurrentUser, (req, res) => {
    const { filter } = req.body;
    const user = req.currentUser;

    Moves.getDataByCatType(filter, user)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

export default router;
