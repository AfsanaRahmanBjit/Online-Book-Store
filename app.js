const express=require("express");
const cors=require("cors");
const app=express();
const dotenv=require("dotenv");
const databaseConnection=require("./config/database");

const AuthRoute=require("./routes/AuthRoute")




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


databaseConnection(()=>{
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
});