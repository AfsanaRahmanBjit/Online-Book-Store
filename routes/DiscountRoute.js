const express = require("express");
const routes = express();
const DiscountController = require("../controller/DiscountController");
const { discountValidator } = require("../middleware/discountValidator");
const {isAuthorized,isAdmin}=require("../middleware/isAuthorized");


routes.post("/add", isAuthorized,isAdmin,discountValidator.add, DiscountController.add);
routes.put("/update/:id", isAuthorized,isAdmin,discountValidator.update, DiscountController.update);
routes.patch("/update/:id", isAuthorized,isAdmin,discountValidator.partialUpdate, DiscountController.partialUpdate);

module.exports = routes;