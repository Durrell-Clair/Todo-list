const express = require('express');
const tasksCtrl = require('../controllers/tasksController');

// Router 
const taskRouter = express.Router();

// Tasks routes

taskRouter.route('/').get(tasksCtrl.tasks);
taskRouter.route('/add/').post(tasksCtrl.addTask);
taskRouter.route('/update').put(tasksCtrl.updateTask);
taskRouter.route('/delete').get(tasksCtrl.deleteTask);

module.exports = taskRouter;