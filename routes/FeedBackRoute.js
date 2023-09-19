const express = require("express");
const routes = express();
const FeedBackController = require("../controller/FeedBackController");
const { feedbackValidator } = require("../middleware/feedbackValidator");
const {isAuthorized,isUser}=require("../middleware/isAuthorized");


routes.post("/add", isAuthorized,isUser,feedbackValidator.add, FeedBackController.add);
routes.put("/update", isAuthorized,isUser,feedbackValidator.update, FeedBackController.update);
routes.delete("/delete", isAuthorized,isUser, FeedBackController.remove);

module.exports = routes;