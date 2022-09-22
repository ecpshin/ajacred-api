const express = require("express");
const {
	getAllUsers,
	createNewUser,
	updateUserData,
	deleteUser,
	getUserProfile,
} = require("./controllers/usuarios");
const { userAuthenticate } = require("./controllers/login");
const {
	isEmailExists,
	verifyLogin,
	emailUpdate,
} = require("./filters/filters");
const routes = express();

routes.post("/login", userAuthenticate);
routes.use(verifyLogin);

routes.get("/usuarios/profile", getUserProfile);
routes.get("/usuarios", getAllUsers);
routes.post("/usuarios", isEmailExists, createNewUser);
routes.patch("/usuarios", emailUpdate, updateUserData);
routes.delete("/usuarios", isEmailExists, deleteUser);

module.exports = routes;
