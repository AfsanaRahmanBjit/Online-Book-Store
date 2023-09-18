const routes = express();
const CartController = require("../controller/CartController");
const { cartValidator } = require("../middleware/cartValidator");
const {isAuthorized,isUser}=require("../middleware/isAuthorized");


routes.get("/get/:id", isAuthorized,isUser,CartController.getByID);
routes.add("/add", isAuthorized,isUser,cartValidator.add, CartController.add);
routes.delete("/delete/:id",isAuthorized,isUser,CartController.deletebyID);

module.exports = routes;