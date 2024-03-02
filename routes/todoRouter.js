const express = require('express');
const todosCtrl = require('../controllers/todosController');

// Router 
const todosRouter = express.Router();

// Todo routes

todosRouter.route('/').get(todosCtrl.todo);
todosRouter.route('/add').post(todosCtrl.addTodo);
todosRouter.route('/update').put(todosCtrl.updateTodo);
todosRouter.route('/delete').get(todosCtrl.deleteTodo);

module.exports = todosRouter;