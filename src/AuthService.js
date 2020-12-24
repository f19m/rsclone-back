/* eslint-disable class-methods-use-this */
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import UserModel from './UserModel';

export default class AuthService {
  static async signUp(email, password, name) {
    const passwordHashed = await argon2.hash(password);

    try {
      const userRecord = await UserModel.create({
        password: passwordHashed,
        email,
        name,
      });

      return {
        user: {
          email: userRecord.email,
          name: userRecord.name,
        },
      };
    } catch (error) {
      console.log(`AuthService: error: ${error}`);
      throw new Error(error.message);
    }
  }

  static async login(email, password) {
    const userRecord = await UserModel.findOne({ email });

    if (!userRecord) {
      throw new Error('User not found');
    } else {
      const correctPassword = await argon2.verify(userRecord.password, password);

      if (!correctPassword) {
        throw new Error('Incorrect password');
      }

      return {
        user: {
          email: userRecord.email,
          name: userRecord.name,
        },
        token: this.generateToken(userRecord),
      };
    }
  }

  static generateToken(user) {
    const data = {
      name: user.name,
      email: user.email,
    };
    const signature = 'MySuP3R_z3kr3t';
    const expiration = '1h';

    return jwt.sign({ data }, signature, { expiresIn: expiration });
  }

  static exec(jwt, query) {

  }
}
