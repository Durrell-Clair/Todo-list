const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');
const taskRouter = require('./routes/tasksRouter');
const { authenticated } = require('./middlewares/authenticate');

const PORT = process.env.PORT || 3300

// Initialisation du serveur
const serveur = express();

// Configuration du body parser
serveur.use(express.json());


// Allow origins
serveur.use(cors({ origin: '*'}))

// Récupération des routes users
serveur.use('/api/users', userRouter);
// serveur.use('/api/blogs', apiBlogs);

// Récupération des routes todo
serveur.use('/api/todos', authenticated, todoRouter);

// Récupération des routes task
serveur.use('/api/tasks', authenticated, taskRouter);

serveur.listen(PORT, () => {
    console.log(`Sever is now listening at port ${PORT}`);
})