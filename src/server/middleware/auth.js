import jwt from 'express-jwt';
import conf from '../config';

// Мы исходим из предположения о том, что JWT приходит на сервер
// в заголовке Authorization, но токен может быть передан и в req.body,
// и в параметре запроса, поэтому вам нужно выбрать тот вариант,
// который подходит вам лучше всего.
const getTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
};

export default {
    required: jwt({
        secret: conf.secret, // Тут должно быть то же самое, что использовалось при подписывании JWT
        userProperty: 'payload', // Здесь следующее промежуточное ПО сможет найти то, что было закодировано в services/auth:generateToken -> 'req.token'
        getToken: getTokenFromHeader, // Функция для получения токена аутентификации из запроса
        algorithms: ['HS256'],
    }),
    optional: jwt({
        secret: conf.secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader,
        algorithms: ['HS256'],
    }),
};
