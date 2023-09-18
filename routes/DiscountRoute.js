const express = require("express");
const routes = express();
const DiscountController = require("../controller/DiscountController");
const { discountValidator } = require("../middleware/discountValidator");
const {isAuthorized,isAdmin}=require("../middleware/isAuthorized");


routes.add("/add", isAuthorized,isAdmin,discountValidator.add, DiscountController.add);
routes.update("/update/:id", isAuthorized,isAdmin,discountValidator.update, DiscountController.update);

module.exports = routes;