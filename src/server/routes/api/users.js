import express from 'express';
import mid from '../../middleware';
import User from '../../models/User';
import Err from '../../../utils/err';

const router = express.Router();
const { AuthService, auth, attachCurrentUser } = mid;

router.post('/login', (req, res) => {
    const err = [];
    if (!req.body.email) {
        err.push('No email specified');
    }
    if (!req.body.password) {
        err.push('No password specified');
    }

    if (err.length) {
        res.status(400).json(new Err(err.join(',')));
    } else {
        AuthService.login(req.body.email, req.body.password)
            .then((data) => {
                console.log('RES OK');
                return res.status(200).json(data);
            })
            .catch((errMsg) => Err.errRet(res, errMsg));
    }
});

router.post('/registration', (req, res) => {
    const err = [];
    if (!req.body.password) {
        err.push('No password specified');
    }
    if (!req.body.email) {
        err.push('No email specified');
    }
    if (!req.body.name) {
        err.push('No name specified');
    }
    if (err.length) {
        res.status(400).json(new Err(err.join(',')));
    } else {
        AuthService.signUp(req.body.email, req.body.password, req.body.name)
            .then((data) => res.status(200).json(data))
            .catch((errMsg) => Err.errRet(res, errMsg));
    }
});

router.post('/users', auth.required, attachCurrentUser, (req, res) => {
    User.getAll()
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

router.post('/user/getInfo', auth.required, attachCurrentUser, (req, res) => {
    const user = req.currentUser;
    User.getUserInfo(user)
        .then((data) => res.json(data))
        .catch((errMsg) => Err.errRet(res, errMsg));
});

export default router;
