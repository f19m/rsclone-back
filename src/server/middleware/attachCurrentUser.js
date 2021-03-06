import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import config from '../config';

export default async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const signature = config.secret;
    const decodedTokenData = jwt.verify(token, signature);

    console.log(`attachCurrentUser: decodedTokenData=${JSON.stringify(decodedTokenData)}`);
    let userRecord;
    try {
        userRecord = await UserModel.findOne(decodedTokenData.data.email);
    } catch (err) {
        return res.status(401).end(err.message);
    }

    req.currentUser = { ...userRecord };
    delete req.currentUser.password;

    console.log('>>>>>>>> currentUser');
    console.log(req.currentUser);

    if (!userRecord) {
        return res.status(401).end('User not found');
    }
    return next();
};
