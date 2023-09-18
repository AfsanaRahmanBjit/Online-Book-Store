const { validationResult } = require("express-validator");
const { success, failure } = require("../output/statements");
const DiscountModel = require("../model/DiscountModel");
const BookModel = require("../model/BookModel");
const HTTP_STATUS = require("../constants/statusCodes");
const { find, findOneAndDelete, findOneAndUpdate, findByIdAndUpdate } = require("../model/AuthModel");

class DiscountController {

    async add(req,res){
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
            return res.status(HTTP_STATUS.OK).send(failure("Failed to add the book", validation));
            }
            const { bookID, discountPercentage, startDate, endDate} = req.body;
            const book= await BookModel.findById({ _id: bookID });
            if (!book) {
       
               return res.status(HTTP_STATUS.NOT_FOUND).send(failure("There is no book exist with the given ID"));
            }
            const currentDate = new Date();

            if (startDate && isNaN(startDate.getTime())) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid start date"));
              }

            if (startDate && startDate < currentDate) {
               
                return res.status(HTTP_STATUS.CONFLICT).send(failure("Start date cannot be in the past"));
              }
              if (endDate && isNaN(endDate.getTime())) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid end date"));
              }
              
            if (endDate && endDate < currentDate) {
               
                return res.status(HTTP_STATUS.CONFLICT).send(failure("End date cannot be in the past"));
              }
            
              const addDiscount=await DiscountModel.create({
                bookID: bookID,
              discountPercentage: discountPercentage,
              startDate:  startDate,
              endDate: endDate,
               });  

            if(addDiscount) {
                return res.status(HTTP_STATUS.OK).send(success("Discount added successfully",addDiscount));
            }
            
            return res.status(HTTP_STATUS.EXPECTATION_FAILED).send(failure("Failed to add discount."));
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));
        }
    }
    async update(req,res){
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
            return res.status(HTTP_STATUS.OK).send(failure("Failed to add the book", validation));
            }
            const{id}=req.params;
            const { bookID, discountPercentage, startDate, endDate} = req.body;
            const book= await DiscountModel.findById({bookID: bookID });
            if (!book) {
       
               return res.status(HTTP_STATUS.NOT_FOUND).send(failure("This book does not have any discount."));
            }
            const currentDate = new Date();

            if (startDate && isNaN(startDate.getTime())) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid start date"));
              }

            if (startDate && startDate < currentDate) {
               
                return res.status(HTTP_STATUS.CONFLICT).send(failure("Start date cannot be in the past"));
              }
              if (endDate && isNaN(endDate.getTime())) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid end date"));
              }
              
            if (endDate && endDate < currentDate) {
               
                return res.status(HTTP_STATUS.CONFLICT).send(failure("End date cannot be in the past"));
              }
            const discountUpdate= await DiscountModel.findByIdAndUpdate(
                id,
                {
                    discountPercentage, startDate, endDate 
                },
                { new: true }
            );

            if (discountUpdate) {
                return res.status(HTTP_STATUS.OK).send(success("Successfully updated the discount data", discountUpdate));
              } 
               return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to update the discount data"));
            
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));
        }
    }

}
module.exports=new DiscountController();
