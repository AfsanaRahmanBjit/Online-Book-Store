const BookModel = require("../model/BookModel");
const CartModel=require("../model/CartModel");
const FeedBackModel=require("../model/FeedBackModel");
const TransactionModel = require("../model/TransactionModel");
const BookModel = require("../model/BookModel");
const HTTP_STATUS = require("../constants/statusCodes");
const { failure, success } = require("../output/statements");

class FeedBackController {
  async add(req, res) {
    try {
      const { userID,bookID,rating, review } = req.body;
      
     const transaction = await TransactionModel.findOne({ userID: userID, 'books.bookID': bookID, checkout: true });
     if (!transaction) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(failure( "You cannot provide feedback for this book without a completing checkout." ));
      }

      const existingFeedback = await FeedBackModel.findOne({ userID: userID, bookID: bookID });
      if (existingFeedback) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(failure('You have already provided feedback for this book. If you want, you can update your feedback.' ));
      }

      const addFeedback = await FeedBackModel.create({
        userID: userID,
        bookID: bookID,
        rating: rating,
        review: review,
      });
      

      book.feedbacks.push(addFeedback._id);
      await book.save();

      if(addFeedback) {
        return res.status(HTTP_STATUS.OK).send(success("Rating and Review added successfully",{FeedBack:addFeedback}));
      }

      return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to add Rating and review"));
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async remove(req, res) {
    try {
      const { userID, bookID } = req.body;
  
      
      const existingFeedback = await FeedBackModel.findOne({ userID, bookID });
  
      if (!existingFeedback) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Rating and review not found for this book.'));
      }
  
      
      if (existingFeedback.userID.toString() !== userID) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure('You are not authorized to remove this rating and review.'));
      }
  
      
      await existingFeedback.remove();
  
      return res.status(HTTP_STATUS.OK).send(success('Rating and review removed successfully.'));
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
    }
  }
  async update(req, res) {
    try {
      const { userID, bookID, rating, review } = req.body;
  
      
      const existingFeedback = await FeedBackModel.findOne({ userID, bookID });
  
      if (!existingFeedback) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Rating and review not found for this book.'));
      }
  
      
      if (existingFeedback.userID.toString() !== userID) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure('You are not authorized to update this rating and review.'));
      }
  
      if(rating){
        existingFeedback.rating = rating;
      }
      //existingFeedback.rating = rating;
      existingFeedback.review = review;
  
      // Save the updated feedback to the database
      await existingFeedback.save();
  
      return res.status(HTTP_STATUS.OK).send(success('Rating and review updated successfully.'));
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
    }
  }

}

module.exports = new FeedBackController();
