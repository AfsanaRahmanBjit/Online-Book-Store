const { validationResult } = require("express-validator");
const { success, failure } = require("../output/statements");
const DiscountModel = require("../model/DiscountModel");
const BookModel = require("../model/BookModel");
const HTTP_STATUS = require("../constants/statusCodes");
const { log } = require('../server/logger');


class DiscountController {

    async add(req,res){
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add the book", validation));
            }
            const { bookID, discountPercentage, startDate, endDate} = req.body;
            const book= await BookModel.findById({ _id: bookID });
            if (!book) {
       
               return res.status(HTTP_STATUS.NOT_FOUND).send(failure("There is no book exist with the given ID"));
            }

            const bookDiscount= await DiscountModel.find({bookID:bookID});
            if (!bookDiscount) {
       
              return res.status(HTTP_STATUS.CONFLICT).send(failure("This book alreay have a discount. If you want you can edit that discount."));
           }
            const currentDate = new Date();

            

            if (startDate && startDate < currentDate) {
               
                return res.status(HTTP_STATUS.CONFLICT).send(failure("Start date cannot be in the past"));
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

              book.discounts.push(addDiscount._id);
              await book.save();
         
            if(addDiscount) {
                return res.status(HTTP_STATUS.CREATED).send(success("Discount added successfully",addDiscount));
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
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add the book", validation));
            }
            const{id}=req.params;
            const { bookID, discountPercentage, startDate, endDate} = req.body;
            const book= await DiscountModel.findById({bookID: bookID });
            if (!book) {
       
               return res.status(HTTP_STATUS.NOT_FOUND).send(failure("This book does not have any discount."));
            }
            const currentDate = new Date();

           

            if (startDate && startDate < currentDate) {
               
                return res.status(HTTP_STATUS.CONFLICT).send(failure("Start date cannot be in the past"));
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
               return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to update the discount data"));
            
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));
        }
    }
    async partialUpdate(req,res){
      try {
          const validation = validationResult(req).array();
          if (validation.length > 0) {
          return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add the book", validation));
          }
          const{id}=req.params;
          const { bookID, discountPercentage, startDate, endDate} = req.body;
          const book= await DiscountModel.find({bookID: bookID });
          if (!book) {
     
             return res.status(HTTP_STATUS.NOT_FOUND).send(failure("This book does not have any discount."));
          }
          const currentDate = new Date();


          if (startDate && startDate < currentDate) {
             
              return res.status(HTTP_STATUS.CONFLICT).send(failure("Start date cannot be in the past"));
            }
            
            
          if (endDate && endDate < currentDate) {
             
              return res.status(HTTP_STATUS.CONFLICT).send(failure("End date cannot be in the past"));
            }

            const updatedFields = {}; 
      
            if (req.body.discountPercentage) {
              updatedFields.discountPercentage = req.body.discountPercentage;
            }
            if (req.body.startDate) {
              updatedFields.startDate = req.body.startDate;
            }
            if (req.body.endDate) {
              updatedFields.endDate= req.body.endDate;
            }
            
            const discountUpdate = await DiscountModel.findByIdAndUpdate(
              id,
              { $set: updatedFields }, 
              { new: true }
            );
          

          if (discountUpdate) {
              return res.status(HTTP_STATUS.OK).send(success("Successfully updated the discount data", discountUpdate));
            } 
          
      } catch (error) {
          console.error(error);
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));
      }
  }
}
module.exports=new DiscountController();
