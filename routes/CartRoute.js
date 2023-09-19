const express = require("express");
const routes = express();

const CartController = require("../controller/CartController");
const { cartValidator } = require("../middleware/cartValidator");
const {isAuthorized,isUser}=require("../middleware/isAuthorized");


routes.get("/get/:userID", isAuthorized,isUser,CartController.getCart);
routes.post("/add", isAuthorized,isUser,cartValidator.add, CartController.addBookToCart);
routes.delete("/delete",isAuthorized,isUser,CartController.removeBookFromCart);

module.exports = routes;