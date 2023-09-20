const express = require('express');
const { validationResult } = require("express-validator");
const { success, failure } = require("../output/statements");
const AuthModel = require("../model/AuthModel");
const UserModel = require('../model/UserModel');
const HTTP_STATUS = require("../constants/statusCodes");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { log } = require('../server/logger');

class AuthController {

    async login(req,res){
    try {

        const validation= validationResult(req).array();
        if(validation.length>0){
            return res.status(HTTP_STATUS.OK).send(failure("Failed to log in",validation));
        }
        const{email,password}=req.body;

        const authUser = await AuthModel.findOne({ email }).populate("userID","-createdAt -updatedAt").select("-createdAt -updatedAt");

        if (!authUser){
            return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Please sign up to create an account"));
        }

        const passwordMatch = await bcrypt.compare(password, authUser.password);

        if(!passwordMatch){

            return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Please provide the correct Email and password."));
        }

        const responseAuth=authUser.toObject();
        delete responseAuth.password;
        //delete responseAuth._id;

        const jwt=jsonwebtoken.sign(responseAuth, process.env.SECRET_KEY,{expiresIn:"24h"});
        responseAuth.token=jwt;

        return res.status(HTTP_STATUS.OK).send(success("You are Logged in successfully!!!",responseAuth));

    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));
    }

    }

    

    async singnUp(req, res) {
        try {
            log(req.headers + "/ Authentication route was accessed for signning up");
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add the user", validation));
            }
            const { name, email, password, phone, balance, role } = req.body;

            const existingUser = await UserModel.findOne({ email: email });

            if (existingUser) {
                return res.status(HTTP_STATUS.CONFLICT).send(failure("User already exists with this email ID"));
            }
            const user = await UserModel.create({
                name: name,
                email: email,
                phone: phone,
                balance: balance || 0,
                role: role || 2,
                verified: true,

            });


            const hashedPassword = await bcrypt.hash(password, 10);


            await AuthModel.create({
                email: email,
                password: hashedPassword,
                role: role,
                verified: true,
                userID: user._id,


            });

            return res.status(HTTP_STATUS.CREATED).send(success("Registration successful!!!"));


        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));

        }

    }

}
module.exports = new AuthController();