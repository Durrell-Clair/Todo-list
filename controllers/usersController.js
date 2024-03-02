// Imports
const bcrypt = require('bcrypt');
const  models  = require('../models');
const asyncLib = require('async')
const jwtUtils = require('../utils/jwt.utils');

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/

// Routes
module.exports = {
    // Controller pour lister les utilisateurs
    users: async (req, res) => {
        
        const  users = await models.User.findAll()
        
        return res.status(201).json({ 
            message: "List of users",
            status: 201,
            users: users
        })
    },

    // Controller pour l'inscription
    register: async (req, res) => {

        // Params
        const username = req.body.username;
        const email    = req.body.email;
        const password = req.body.password;

        
        if (username == null || email == null || password == null) {
            return res.status(400).json({'error': 'missing parameters', data: req.body})
        }

        if (username.length >= 13 || username.length <= 4) {
            return res.status(400).json({error: 'wrong username (must be length 5 - 12)'})
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({error: 'email is not valid'})
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({error: 'password is not valid (must length 4 - 8 and includ 1 number at least).'})
        }

        // Creation d'un nouvel utilisateur en tulisant un waterfall
        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attibutes: ['email'],
                    where: { email: email }
                })
                .then(function(userFound) {
                    done(null, userFound)
                })
                .catch(function (err){
                    return res.status(500).json({error: "Unable de verify user"})
                })
            },
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function(err, bcryptedPassword){
                        done(null, userFound, bcryptedPassword)
                    })
                }
                else {
                    return res.status(409).json({error: "User already exist"})
                }
            },
            function (userFound, bcryptedPassword, done) {
                const newUser = models.User.create({
                    username: username,
                    email: email,
                    password: bcryptedPassword
                })
                .then(function(newUser) {
                    done(newUser);
                })
                .catch(function (err){
                    return res.status(500).json({error: 'Cannot add user'})
                });
            }
        ], function(newUser) {
            if (newUser) {
                return res.status(201).json({
                    userId: newUser.id
                })
            } else {
                return res.status(500).json({error: 'Cannot add user'})
            }
        });
    },

    // Controller du login
    login: async function (req, res) {

        const email = req.body.email;
        const password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({'error': 'missing parameters', data: req.body})
        }
        models.User.findOne({
            where: { email: email }
        })
        .then(function(userFound) {
            if (userFound) {                
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                    if (resBycrypt) {
                        return res.status(200).json({
                            UserId: userFound.id,
                            token: jwtUtils.generateTokenForUser(userFound)
                        })
                    } else {
                        return res.status(403).json({error: "invalid password"});
                    }
                })
            }
            else {
                return res.status(404).json({error: "User not exist in data base"})
            }
        })
        .catch(function(err) {
            return res.status(500).json({error: "Unable de verify user"})
        })
    },


    // Controller de l'affichage du profile
    getUserProfile: function(req, res) {
        const UserId = req.UserId
        models.User.findOne({
            attibutes: ['id', 'email', 'username'],
            where: {id: UserId}
        }).then(function (user) {
            if (user) {
                return res.status(200).json({ success: true,
                    status: 200,
                    message: "User found",
                    result: user
                });
            }    
            return res.status(400).json({error: 'user not found'});        
        }).catch(function (err) {
                res.status(500).json({'error': 'Cannot fetch user'})
        })
    },


    // Edit Username
    updateUsername: async (req, res) => {

        // Params
        const {UserId, updatedUsername} = req.body;

        if (UserId == null || updatedUsername == null) {
            return res.status(400).json({error: 'missing parameters.'});
        }
        if (typeof(UserId) != 'number') {
            return res.status(400).json({error: 'user id must be a number.'});
        }
        const userFound = await models.User.findOne({
            attibutes: ['username'],
            where: {id: UserId}
        })        
        if (userFound != null) {
            if (userFound.username != updatedUsername) {
                const success = models.User.update({username: updatedUsername}, {
                        where: {id: userFound.id}
                })
                if (success) {
                    return res.status(200).json({
                        status: 200,
                        message: 'Username has been updated.'
                    })
                } else {
                    return res.status(500).json({'error': 'Cannot update username'});
                }
            }
            else {
                return res.status(400).json({'error': 'No update detected.'});
            }
        } 
        return res.status(404).json({error: 'user not found'});
    },


    // Edit password
    updatePassword: async (req, res) => {

        // Params
        const {email, currentPassword, updatedPassword} = req.body;

        if (!email || !currentPassword || !updatedPassword ) {
            console.log(email, currentPassword, updatedPassword)
            return res.status(400).json({error: 'missing parameters...'});
        }

        async function hashPassword() {
            try {
                const bcryptedPassword = await bcrypt.hash(req.body.updatedPassword, 5);
                return bcryptedPassword;
            } catch (err) {
                return err
            }
        }
        const updatedPasswordHashed = await hashPassword()

        models.User.findOne({
            where: { email: email }
        })
        .then(function(userFound) {
            if (userFound) {

                bcrypt.compare(currentPassword, userFound.password, function (err, pass){
                    if (pass) {

                        if (currentPassword != updatedPassword) {
                            
                            const updatedPassword = models.User.update({password: updatedPasswordHashed}, {
                                where: {
                                    email: email
                                }
                            });
                            if (updatedPassword) {
                                        return res.status(200).json({message: "Password has been update"});
                            } else {
                                return res.status(500).json({error: "Unable to update password"})
                            }

                        } else {
                            return res.status(403).json({error: "No update found"})
                        }

                    } else {
                        return res.status(403).json({error: "incorrect password"});
                    }
                })
            }
            else {
                return res.status(404).json({error: "User not exist in data base"})
            }
        })
        .catch(function(err) {
            return res.status(500).json({error: "Unable de verify user"})
        })

    }
}