const  models  = require('../models');
const Todo = require('../models/todo');

module.exports = {
    // Fonction pour récupérer toutes les listes associés à un utilisateur
    todo: async  (req, res) => {

        const todos = await models.Todo.findAll({
            where: {
                UserId: req.UserId
            }
        })
 
        return res.status(200).json({ 
            message: "List of todos",
            status: 200,
            todos: todos
        })
    },
    
    // Fonction pour créer une todo
    addTodo: async (req, res) => {

        // Params
        const {UserId, todoName } = req.body;

        if (UserId == null || todoName == null) {
            return res.status(400).json({error: 'missing parameters.'})
        }

        if (typeof UserId != 'number') {
            return res.status(400).json({error: 'user id must be a number.'})
        }

        const todoFound = await models.Todo.findOne({
            attributes: ['UserId', 'todoName'],
            where: {
                UserId: UserId,
                todoName: todoName
            }
        })
        
        if (!todoFound) {
                models.Todo.create({
                    UserId: UserId,
                    todoName: todoName
    
                }).then((newTodo) => {
                    if (newTodo) {
                        return res.status(201).json({
                            success: true,
                            status: 201,
                            result: newTodo
                        })
                    } else {
                        return res.status(500).json({err: 'canot add todo'})
                    }
                }).catch((err) => {
                    return res.status(500).json({err: 'Unable to add todo', message: err.message})
                })
                
            } else {
                return res.status(409).json({error: 'todo already exist.'})
            }
    },

    // Fonction pour moiffier une todo
    updateTodo: async (req, res) => {

        // Params
        const {id, updatedTodoName} = req.body;

        if (id == null || updatedTodoName == null) {
            return res.status(400).json({error: 'missing parameters.'})
        }

        if (typeof id != 'number') {
            return res.status(400).json({error: 'todo id must be a number.'})
        }

        const todoFound = await models.Todo.findOne({
            attributes: ['todoName'],
            where: {
                id: id
            }
        })
        
        if (todoFound != null) {
            if ( updatedTodoName != todoFound.todoName) {
                const updatedTodo = await models.Todo.update(({todoName: updatedTodoName}), {
                    where: {
                        id: id,
                    }
                })
                if (updatedTodo) {
                    return res.status(200).json({
                        id: id,
                        message: 'Todo '+ todoFound.todoName +' as been update.',
                        todoName: updatedTodoName
                    })
                } else {
                    return res.status(500).json({err: 'canot update todo'})
                }
            } else {
                return res.status(403).json({error: 'No change to update.'})
            }
        } else {
            return res.status(500).json({error: 'Todo doesn\'t exist'})
        }        
    },

    //Fonction pour supprimer une todo
    deleteTodo: async (req, res) => {

        // Params
        const {id} = req.body;

        if (id == null) {
            return res.status(400).json({error: 'missing parameters.'})
        }

        if (typeof id != 'number') {
            return res.status(400).json({error: 'todo id must be a number.'})
        }
        
        const todoFound = await models.Todo.findOne({
            attributes: ['id'],
            where: {
                id: id,
            }
        })

        if (todoFound != null) {
            const deletedTodo = models.Todo.destroy({
                attributes: ['id'],
                where: {
                    id: id,
                }
            })
            if (deletedTodo) {
                return res.status(200).json({
                    message: 'todo has been deleted.'
                });
            } else {
                return res.status(500).json({error: 'Cannot delete todo.'})
            }
        } else {
            return res.status(409).json({error: "Todo not found."})
        }
    }
}