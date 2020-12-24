import jwt from 'jsonwebtoken';
import UserModel from './UserModel';

export default async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const signature = 'MySuP3R_z3kr3t';
  const decodedTokenData = jwt.verify(token, signature);

  console.log(`attachCurrentUser: decodedTokenData=${JSON.stringify(decodedTokenData)}`);

  const userRecord = await UserModel.findOne({ email: decodedTokenData.data.email });

  req.currentUser = userRecord;

  if (!userRecord) {
    return res.status(401).end('User not found');
  }
  return next();
};
