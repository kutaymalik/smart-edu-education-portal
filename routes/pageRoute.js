import express from "express";
import * as pageController from '../controllers/pageController.js';
import redirectMiddleware from "../middlewares/redirectMiddleware.js";

const pageRoute = express.Router();

pageRoute.route('/').get(pageController.getIndexPage);
pageRoute.route('/about').get(pageController.getAboutPage);
pageRoute.route('/register').get(redirectMiddleware, pageController.getRegisterPage);
pageRoute.route('/login').get(redirectMiddleware, pageController.getLoginPage);
pageRoute.route('/contact').get(pageController.getContactPage);
pageRoute.route('/contact').post(pageController.sendEmail);

export { pageRoute };