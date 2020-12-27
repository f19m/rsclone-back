import express from 'express';
import mid from '../../middleware';
import User from '../../models/User';
import Err from '../../../utils/err';

const router = express.Router();
const { AuthService, auth, attachCurrentUser } = mid;

router.post('/login', (req, res, next) => {
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
            .then((data) => res.json(JSON.stringify(data)))
            .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
    }
});

router.post('/registration', (req, res, next) => {
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
            .then((data) => res.json(JSON.stringify(data)))
            .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
    }
});

router.post('/users', auth.required, attachCurrentUser, (req, res, next) => {
    User.getAll()
        .then((data) => res.json(JSON.stringify(data)))
        .catch((errMsg) => res.status(400).json(new Err(errMsg.message)));
});

export default router;
