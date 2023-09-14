const { validationResult } = require("express-validator");
const { success, failure } = require("../output/statements");
const AuthModel = require("../model/AuthModel");
const UserModel = require('../model/UserModel');
const HTTP_STATUS = require("../constants/statusCodes");
const bcrypt=require("bcrypt");
const jsonwebtoken=require("jsonwebtoken");

class AuthController{

async login(req,res){
try {
    const validation= validationResult(req).array();
    if(validation.length>0){
        return res.status(HTTP_STATUS.OK).send(failure("Failed to add the user",validation));
    }
    const{email,password}=req.body;
   
    const authUser = await AuthModel.findOne({ email }).populate("user","-createdAt -updatedAt").select("-createdAt -updatedAt");
   
    if (!authUser){
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Please sign up to create an account"));
    }
    
    const passwordMatch = await bcrypt.compare(password, authUser.password);

    if(!passwordMatch){
         
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Invalid credentials"));
    }
    
    const responseAuth=authUser.toObject();
    delete responseAuth.password;
    //delete responseAuth._id;

    const jwt=jsonwebtoken.sign(responseAuth, process.env.SECRET_KEY,{expiresIn:"1h"});
    responseAuth.token=jwt;
    
    return res.status(HTTP_STATUS.OK).send(success("You are Logged in successfully!!!",responseAuth));
    
} catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));
}

}
async singnUp(req,res){
    try {
    const validation= validationResult(req).array();
    if(validation.length>0){
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add the user",validation));
    }
    const{name,email,password,phone,balance, address,role}=req.body;

    const existingUser = await UserModel.findOne({ email:email });

    if (existingUser) {
        return res.status(HTTP_STATUS.CONFLICT).send(failure("User already exists with this email"));
      }
    const user=await UserModel.create({
        name:name,
        email: email,
        phone:phone,
        balance:balance,
        address:address,

     });
      

    const hashedPassword = await bcrypt.hash(password, 10); 
    
    
    await AuthModel.create({
        email:email,
        password: hashedPassword,
        role:role,
        verified: false,
        user: user._id,
        

      });
  
     return res.status(HTTP_STATUS.OK).send(success("User registered successfully"));

        
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));
   
    }

}

}
module.exports=new AuthController();