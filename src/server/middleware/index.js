import { Validator, ValidationError } from 'express-json-validator-middleware';
import auth from './auth';
import AuthService from './AuthService';
import attachCurrentUser from './attachCurrentUser';

const validator = new Validator({ allErrors: true });
const { validate } = validator;

export default {
    auth, AuthService, attachCurrentUser, validate, ValidationError,
};
