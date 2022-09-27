const express = require("express");
const usuarios = require("./controllers/usuarios");
const clientes = require("./controllers/clients");
const { userAuthenticate } = require("./controllers/login");
const {
	isEmailExists,
	verifyLogin,
	emailUpdate,
} = require("./filters/filters");
const routes = express();

routes.post("/login", userAuthenticate);
routes.post("/usuarios", isEmailExists, usuarios.createNewUser);

routes.use(verifyLogin);

routes.get("/clientes", clientes.getAllClients);

routes.get("/usuarios/profile", usuarios.getUserProfile);
routes.get("/usuarios", usuarios.getAllUsers);
routes.patch("/usuarios", emailUpdate, usuarios.updateUserData);
routes.delete("/usuarios", isEmailExists, usuarios.deleteUser);

module.exports = routes;
