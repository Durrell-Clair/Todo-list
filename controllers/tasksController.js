// Imports
// const { where } = require('sequelize');
const  models  = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const authenticated = require('../middlewares/authenticate');


module.exports = {

    // Fonction pour récupérer toutes les tâches associées à une liste
    tasks: async  (req, res) => {

        const tasks = await models.Task.findAll({
            attributes: ['id', 'TodoId', 'taskName'],
            where: {
                TodoId: req.body.TodoId
            }
        })
        
        return res.status(201).json({ 
            message: "List of tasks",
            status: 201,
            tasks: tasks
        })
    },
    
    // Fonction pour créer une tâche
    addTask: async (req, res) => {

        // Params
        const {TodoId, taskName } = req.body;

        if (TodoId == null || taskName == null) {
            return res.status(400).json({error: 'missing parameters.'})
        }

        if (typeof TodoId != 'number') {
            return res.status(400).json({error: 'todo id must be a number.'})
        }

        const taskFound = await models.Task.findOne({
            attributes: ['TodoId', 'taskName'],
            where: {
                TodoId: TodoId,
                taskName: taskName
            }
        })
        
        
        if (!taskFound) {
            const newTask = await models.Task.create({
                TodoId: TodoId,
                taskName: taskName
    
            })
            if (newTask) {
                return res.status(201).json({
                    id: newTask.id,
                    taskName: newTask.taskName,
                })
            } else {
                return res.status(500).json({err: 'canot add task'})
            }
        } else {
                return res.status(403).json({error: 'task already exist.'})
        }
        
    },

    // Fonction pour moiffier une tâche
    updateTask: async (req, res) => {

        // Params
        const {id, updatedTaskName} = req.body;

        if (id == null || updatedTaskName == null) {
            return res.status(400).json({error: 'missing parameters.'})
        }

        if (typeof id != 'number') {
            return res.status(400).json({error: 'task id must be a number.'})
        }

        const taskFound = await models.Task.findOne({
            attributes: ['taskName'],
            where: {
                id: id,
            }
        })
        
        if (taskFound != null) {
            if ( updatedTaskName != taskFound.taskName) {
                const updatedTask = await models.Task.update(({taskName: updatedTaskName}), {
                    where: {
                        id: id,
                    }
                })
                if (updatedTask) {
                    return res.status(200).json({
                        id: updatedTask.id,
                        taskName: updatedTaskName
                    })
                } else {
                    return res.status(500).json({err: 'canot update task'})
                }
            } else {
                return res.status(403).json({error: 'No change to update.'})
            }
        } else {
            return res.status(500).json({error: 'Task not found'})
        }        
    },

    //Fonction pour supprimer une tâche
    deleteTask: async (req, res) => {

        // Params
        const {id} = req.body;

        if (id == null) {
            return res.status(400).json({error: 'missing parameters.'})
        }

        if (typeof id != 'number') {
            return res.status(400).json({error: 'task id must be a number.'})
        }

        const taskFound = await models.Task.findOne({
            attributes: ['id'],
            where: {
                id: id
            }
        })

        if (taskFound != null) {
            const deletedTask = models.Task.destroy({
                attributes: ['id', 'TodoId', 'taskName'],
                where: {
                    id: id,
                }
            })
            if (deletedTask) {
                return res.status(200).json({
                    message: 'Task has been deleted.'
                });
            } else {
                return res.status(500).json({error: 'Cannot delete task.'})
            }
        } else {
            return res.status(409).json({error: "task not found."})
        }
    }
}