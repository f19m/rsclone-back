import express from 'express';
import userRouter from './users';
import userCatRouter from './userCategories';
import tagsRouter from './tags';
import movesRouter from './moves';
// import Err from '../../../utils/err';

const router = express.Router();
router.use('/', userRouter);
router.use('/', userCatRouter);
router.use('/', tagsRouter);
router.use('/', movesRouter);

export default router;
