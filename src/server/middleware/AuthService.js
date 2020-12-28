/* eslint-disable class-methods-use-this */
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import config from '../config';

export default class AuthService {
    static async login(email, password) {
        const userRecord = await UserModel.findOne(email);

        if (!userRecord) {
            throw new Error('User or password incorrect');
        } else {
            const correctPassword = await argon2.verify(userRecord.password, password);

            if (!correctPassword) {
                throw new Error('Incorrect password');
            }

            // get all data for user

            return {
                data: {
                    user: {
                        email: userRecord.email,
                        name: userRecord.name,
                    },
                },
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
