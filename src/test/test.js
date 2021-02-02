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
        const userResp = await request(app)
            .post('/api/registration')
            .set('Content-type', 'application/json')
            .send(JSON.stringify({
                name: 'user2',
                email: 'user2@email.com',
                password: '123',
            }));

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
        testObjects.userCatList = response.body.data.user.userCategories;

        if (userResp.status === 200) {
            await request(app)
                .post('/api/user/dataGenerate')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${tokenObj.value}`)
                .send();
        }
    }, 15000);
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
    test('It return create user category', async () => {
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

describe('Test create tag', () => {
    test('It return create user tag', async () => {
        const insertObj = {
            name: 'TestTag',
        };

        const response = await request(app)
            .post('/api/tags/create')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send(insertObj);

        //  expect(response).toBe('200');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');

        testObjects.tag = response.body;
    }, 5000);
});

describe('Test update tag', () => {
    test('It return updated user tag', async () => {
        testObjects.tag.name += '!';

        const response = await request(app)
            .post('/api/tags/update')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send({
                tag: {
                    id: testObjects.tag.id,
                    name: `${testObjects.tag.name}!`,
                },
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(`${testObjects.tag.name}!`);
    }, 5000);
});

describe('Test get user tags', () => {
    test('It return array of tags', async () => {
        const response = await request(app)
            .post('/api/tags/get')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send();

        //  expect(response).toBe('200');

        expect(response.status).toBe(200);
        expect(response.body.length).not.toBe(0);
    }, 5000);
});

describe('Test delete tag', () => {
    test('It delete user tag', async () => {
        const response = await request(app)
            .post('/api/tags/delete')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send({
                tag: {
                    id: testObjects.tag.id,
                },
            });

        expect(response.status).toBe(307);
        expect(response.text).toBe('Temporary Redirect. Redirecting to /api/user/getInfo');
    }, 5000);
});

describe('Test create move', () => {
    test('It return create user money move', async () => {
        const catFromArr = testObjects.userCatList.filter((el) => el.type === 2);
        const catToArr = testObjects.userCatList.filter((el) => el.type === 3);
        const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const catFrom = getRandomItem(catFromArr);
        const catTo = getRandomItem(catToArr);

        const insertObj = {
            cat_from: catFrom.id,
            cat_to: catTo.id,
            date: '2020-01-01',
            value: 100,
            comment: 'test comment',
        };

        const response = await request(app)
            .post('/api/moves/create')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send({ move: insertObj });

        //  expect(response).toBe('200');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('cat_from');
        expect(response.body).toHaveProperty('cat_to');
        expect(response.body).toHaveProperty('move');
        expect(response.body.move).toHaveProperty('id');

        Object.keys(insertObj).forEach((key) => {
            if (key === 'value') {
                expect(parseInt(response.body.move[key], 10)).toBe(parseInt(insertObj[key], 10));
            } else if (key !== 'date') expect(response.body.move[key]).toBe(insertObj[key]);
        });

        testObjects.move = response.body.move;
    }, 5000);
});

describe('Test update move', () => {
    test('It return updated user money move', async () => {
        const updateObj = {
            value: 120,
            comment: 'test comment1',
            id: testObjects.move.id,
        };

        const response = await request(app)
            .post('/api/moves/update')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send({ move: updateObj });

        //  expect(response).toBe('200');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('cat_from');
        expect(response.body).toHaveProperty('cat_to');
        expect(response.body).toHaveProperty('move');

        Object.keys(updateObj).forEach((key) => {
            if (key === 'value') {
                expect(parseInt(response.body.move[key], 10)).toBe(parseInt(updateObj[key], 10));
            } else if (key !== 'date') expect(response.body.move[key]).toBe(updateObj[key]);
        });
    }, 5000);
});

describe('Test get moves with offset return', () => {
    test('It return arr of user money moves with offset return', async () => {
        const response = await request(app)
            .post('/api/moves/get')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send();

        //  expect(response).toBe('200');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('offset');
        expect(response.body.data.length).not.toBe(0);

        testObjects.offset = response.body.offset;
    }, 5000);
});

describe('Test get moves by offset', () => {
    test('It return arr of user money moves by using offset', async () => {
        const response = await request(app)
            .post('/api/moves/get')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send({
                offset: testObjects.offset,
            });

        //  expect(response).toBe('200');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('offset');
        expect(response.body.data.length).not.toBe(0);

        testObjects.offset = response.body.offset;
    }, 5000);
});

describe('Test get all moves with offset', () => {
    test('It return arr of all user money moves', async () => {
        const response = await request(app)
            .post('/api/moves/getAll')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send();

        //  expect(response).toBe('200');

        expect(response.status).toBe(200);
        expect(response.body.length).not.toBe(0);
    }, 5000);
});

describe('Test delete move', () => {
    test('It  delete user money move', async () => {
        const response = await request(app)
            .post('/api/moves/delete')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${tokenObj.value}`)
            .send({
                move: {
                    id: testObjects.move.id,
                },
            });

        //  expect(response).toBe('200');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('cat_from');
        expect(response.body).toHaveProperty('cat_to');
        expect(response.body).toHaveProperty('move');
    }, 5000);
});
