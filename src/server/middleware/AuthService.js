/* eslint-disable class-methods-use-this */
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import Err from '../../utils/err';

import config from '../config';

/**
 * AuthService class
 */

class AuthService {
    /**
     * @typedef {loginUserData} loginUserData
     * @property {Object} data object with all info
     * @property {Object} data.user object with user info
     * @property {String} data.user.email user email
     * @property {String} data.user.name user name
     * @property {Object[]} data.user.categories array of user categories object
     * @property {String} data.token JWT token for requests requiring authorization
     */

    /**
     * method for user authorization
     * @param {String} email user email
     * @param {String} password user password
     * @return {loginUserData} object with user information data
     */
    static async login(email, password) {
        const userRecord = await UserModel.findOne(email);

        if (!userRecord) {
            throw new Err('User or password incorrect', 400);
        } else {
            const correctPassword = await argon2.verify(userRecord.password, password);

            if (!correctPassword) {
                throw new Err('Incorrect password', 401);
            }

            const resData = await UserModel.getUserInfo(userRecord);
            return {
                data: resData,
                token: this.generateToken(userRecord),
            };
        }
    }

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

    static generateToken(user) {
        const data = {
            name: user.name,
            email: user.email,
        };
        const signature = config.secret;
        const expiration = '1h';

        return jwt.sign({ data }, signature, { expiresIn: expiration });
    }

    static exec(jwt, query) {

    }
}

export default AuthService;
