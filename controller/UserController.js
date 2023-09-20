const { validationResult } = require("express-validator");
const { success, failure } = require("../output/statements");
const UserModel = require("../model/UserModel");
const HTTP_STATUS = require("../constants/statusCodes");
const { log } = require('../server/logger');

class UserController {
  async getAll(req, res) {
    try {
      const users = await UserModel.find({});
      if (users.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully received all users data", { result: users, total: users.length }));
      }
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No users were found"));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async update(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to update the user data", validation));
      }
  
      const { id } = req.params;
      const user = await UserModel.findById({_id:id});
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User not found for the given ID"));
      }
  
      const {name,email,phone,role,verified}=req.body;

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { name,email,phone,role,verified }, 
        { new: true }
      );
  
      if (updatedUser) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully updated the user data", updatedUser));
      } 
       return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to update the user data"));
      } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async partialUpdate(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to update the user data", validation));
      }
  
      const { id } = req.params;
      const user = await UserModel.findById({_id:id});
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User not found for the given ID"));
      }
  
      const updatedFields = {}; 
      
      if (req.body.name) {
        updatedFields.name = req.body.name;
      }
      if (req.body.email) {
        updatedFields.email = req.body.email;
      }
      if (req.body.phone) {
        updatedFields.rank = req.body.phone;
      }
      if (req.body.role) {
        updatedFields.role = req.body.role;
      }
      if (req.body.verified) {
        updatedFields.discountPercentage = req.body.verified;
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { $set: updatedFields }, 
        { new: true }
      );
  
      if (updatedUser) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully updated the user data", updatedUser));
      } 
       return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to update the user data"));
      } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async balanceUpdate(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to update the user data", validation));
      }
  
      const { id } = req.params;
      const user = await UserModel.findById({_id:id});
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User not found for the given ID"));
      }
  
      const {balance}=req.body;

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { balance }, 
        { new: true }
      );
  
      if (updatedUser) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully updated the user balance", updatedUser));
      } 
       return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to update the user balance"));
      } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async deleteOneById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById({ _id: id });
      if(!user){
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist with the given ID"));
      }
      
      const deleteUser = await UserModel.findByIdAndDelete({ _id: id });
      if (deleteUser) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully deleted the user data"));
      }
      return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to delete the user data"));
      
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }


 
 


}

module.exports = new UserController();