const express = require('express');

const usersCtrl = require('../controllers/usersController');
const { authenticated } = require('../middlewares/authenticate');

// Router 
const userRouter = express.Router();

// Users routes
userRouter.route('/').get(authenticated, usersCtrl.users);

userRouter.route('/register').post(usersCtrl.register);

userRouter.route('/login').post(usersCtrl.login);

userRouter.route('/me/edit/username').put(authenticated, usersCtrl.updateUsername);

userRouter.route('/me').get(authenticated, usersCtrl.getUserProfile);


userRouter.route('/me/edit/password').put(authenticated, usersCtrl.updatePassword);

module.exports = userRouter;