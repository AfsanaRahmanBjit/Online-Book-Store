const express = require("express");
const routes = express();
const TransactionController = require("../controller/TransactionController");
const {isAuthorized,isUser,isAdmin}=require("../middleware/isAuthorized");

routes.get("/all", isAuthorized,isAdmin,TransactionController.getAll);
routes.get("/get/:userID", isAuthorized,isUser,TransactionController.getUserTransaction);
routes.post("/checkout", isAuthorized,isUser,TransactionController.checkout);

module.exports = routes;