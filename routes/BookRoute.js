const express = require("express");
const routes = express();
const BookController= require("../controller/BookController");
const {bookValidator } = require("../middleware/bookValidator");
const {isAuthorized,isAdmin}=require("../middleware/isAuthorized");

//routes.get("/all",ProductController.getAll);



routes.get("/get/:id", isAuthorized,isAdmin,BookController.getOneById);
routes.post("/add", isAuthorized,isAdmin,bookValidator.create, BookController.add);
routes.put("/update/:id",isAuthorized,isAdmin,bookValidator.create,BookController.update);
routes.delete("/delete/:id",isAuthorized,isAdmin,BookController.deleteOneById);


