import request from 'supertest';
import app from '../server/index';

// import sequelize from './sequelize';
import db from '../database/setup';
import config from '../server/config';

// db.sync();

const tokenObj = {};
tokenObj.value = null;
const testObjects = {};

describe('Test GET req', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/api/users');
        // console.log(response);
        expect(response.statusCode).toBe(200);
    }, 5000);
});

describe('Test Post req', () => {
    test('It should response the POST method', async () => {
        const response = await request(app)
            .post('/api/login')
            .set('Content-type', 'application/json')
            .send(JSON.stringify({
                email: 'notExistMail@notExistMail.org',
                password: 'notExistMail',
            }));

        expect(response.status).toBe(404);
    }, 5000);
});

describe('Test Login req without email', () => {
    test('It should return error, than email requered', async () => {
        const response = await request(app)
            .post('/api/login')
            .set('Content-type', 'application/json')
            .send(JSON.stringify({
                password: 'notExistMail',
            }));

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({ error: 'No email specified' });
    }, 5000);
});

describe('Test Registration req without name and email', () => {
    test('It should return error, than email and name requered', async () => {
        const response = await request(app)
            .post('/api/registration')
            .set('Content-type', 'application/json')
            .send(JSON.stringify({
                password: 'notExistMail',
            }));

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({ error: 'No email specified, No name specified' });
    }, 5000);
});

describe('Test Success login', () => {
    test('It should return userInfo and token', async () => {
        const response = await request(app)
            .post('/api/login')
            .set('Content-type', 'application/json')
            .send(JSON.stringify({
                email: 'user2@email.com',
                password: '123',
            }));

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('token');
        tokenObj.value = response.body.token;
    }, 5000);
});

describe('Test get categories', () => {
    test('It return array of user categories', async () => {
        const response = await request(app)
            .post('/api/categories/get')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).not.toBe(0);
    }, 5000);
});

describe('Test get categories attribute', () => {
    test('It check user categories attribute', async () => {
        const response = await request(app)
            .post('/api/categories/get')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send();

        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('type');
        expect(response.body[0]).toHaveProperty('plan');
        expect(response.body[0]).toHaveProperty('summa');
        expect(response.body[0]).toHaveProperty('user');
        expect(response.body[0]).toHaveProperty('icoUrl');

        testObjects.userCat = response.body[0];
    }, 5000);
});

describe('Test update category', () => {
    test('It return updated user category', async () => {
        const response = await request(app)
            .post('/api/categories/update')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send({
                id: testObjects.userCat.id,
                name: `${testObjects.userCat.name}!`,
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(`${testObjects.userCat.name}!`);
    }, 5000);
});

describe('Test create category', () => {
    test('It return updated user category', async () => {
        const insertObj = {
            name: 'Test',
            type: 2,
            plan: 150.00,
            summa: 10.00,
            icoUrl: 'string',
        };

        const response = await request(app)
            .post('/api/categories/create')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send(insertObj);

        //  expect(response).toBe('200');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');

        Object.keys(insertObj).forEach((key) => {
            if (key === 'plan' || key === 'summa') {
                expect(parseInt(response.body[key], 10)).toBe(parseInt(insertObj[key], 10));
            } else {
                expect(response.body[key]).toBe(insertObj[key]);
            }
        });

        testObjects.deleteUserCat = response.body;
    }, 5000);
});

describe('Test delete category', () => {
    test('It delete user category', async () => {
        const response = await request(app)
            .post('/api/categories/delete')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send({
                userCat: {
                    id: testObjects.deleteUserCat.id,
                },
            });

        expect(response.status).toBe(307);
        expect(response.text).toBe('Temporary Redirect. Redirecting to /api/user/getInfo');
    }, 5000);
});
