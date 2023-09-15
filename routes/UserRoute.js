const express = require("express");
const routes = express();
const UserController = require("../controller/UserController");
const { userValidator } = require("../middleware/userValidator");
const {isAuthorized,isAdmin}=require("../middleware/isAuthorized");

routes.get("/all", isAuthorized,isAdmin,UserController.getAll);
routes.put("/update/:id", isAuthorized,isAdmin,userValidator.update, UserController.update);
routes.delete("/delete/:id",isAuthorized,isAdmin,UserController.deleteOneById);

module.exports = routes;