const express = require('express');
const { getAllUsers, createNewUser } = require('./controllers/usuarios');
const { userAuthenticate } = require('./controllers/login');
const { isEmailExists } = require('./filters/filters');
const routes = express();

routes.get('/usuarios', getAllUsers);
routes.post('/login', userAuthenticate);
routes.post('/usuarios', isEmailExists, createNewUser);

module.exports = routes;