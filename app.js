const express = ("express");
const cors = ("cors");
const app = ();
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");

const AuthRoute = require("./routes/AuthRoute");
const UserRoute = require("./routes/UserRoute");
const BookRoute = require("./routes/BookRoute");
const TransactionRoute = require("./routes/TransactionRoute");
const CartRoute = require("./routes/CartRoute");
const DiscountRoute = require("./routes/DiscountRoute");





dotenv.config();
app.use(cors({origin:"*"}));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}));
// app.use((err,req,res,next)=>{
//   if(err instanceof SyntaxError && err.status===400 && "body" in err){
//     return res.status(400).send({message:"Invalid JSON FormData."});
//   }
//   next();
// });
app.use("/auths",AuthRoute);
app.use("/users",UserRoute);
app.use("/books",BookRoute);
app.use("/discounts",DiscountRoute);
app.use("/carts",CartRoute);
app.use("/transactions",TransactionRoute);

databaseConnection(()=>{
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
});