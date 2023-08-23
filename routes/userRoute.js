import express from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';

import {
    createUser,
    deleteUser,
    getDashboardPage,
    loginUser,
    logoutUser,
} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const userRoute = express.Router();

userRoute.route('/signup').post(
    [
        body('name').not().isEmpty().withMessage('Please enter your name!'),

        body('email')
            .isEmail()
            .withMessage('Please enter valid email!')
            .custom((userEmail) => {
                return User.findOne({ email: userEmail }).then((user) => {
                    if (user) {
                        return Promise.reject('Email is already exists!');
                    }
                });
            }),

        body('password').not().isEmpty().withMessage('Please enter a password'),
    ],
    createUser
); // https://localhost:3000/users/signup

userRoute.route('/login').post(loginUser); // https://localhost:3000/users/login
userRoute.route('/logout').get(logoutUser); // https://localhost:3000/users/logout
userRoute.route('/dashboard').get(authMiddleware, getDashboardPage); // https://localhost:3000/users/getDashboardPage
userRoute.route('/:id').delete(deleteUser);

export { userRoute };
