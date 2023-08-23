import express from 'express';
import { createCategory } from '../controllers/categoryController.js';

const categoryRoute = express.Router();

categoryRoute.route('/').post(createCategory);

export { categoryRoute };