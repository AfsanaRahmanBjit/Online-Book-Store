const BookModel = require("../model/BookModel");
const CartModel=require("../model/CartModel");
const FeedBackModel=require("../model/FeedBackModel");
const TransactionModel = require("../model/TransactionModel");
const HTTP_STATUS = require("../constants/statusCodes");
const { failure, success } = require("../output/statements");
const { log } = require('../server/logger');

class FeedBackController {
  async add(req, res) {
    try {
      const { userID,bookID,rating, review } = req.body;
      
     const transaction = await TransactionModel.findOne({ userID: userID, 'books.bookID': bookID});
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
      const book= await BookModel.findById({ _id: bookID });
      if (!book) {
       
               return res.status(HTTP_STATUS.NOT_FOUND).send(failure("There is no book exist with the given ID"));
      }

      book.reviews.push(addFeedback._id);
      await book.save();

      const feedbacks = await FeedBackModel.find({ bookID: bookID });
      const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
      const averageRating = totalRating / feedbacks.length;
      await BookModel.findByIdAndUpdate(bookID, { rating: averageRating });


      if(addFeedback) {
        return res.status(HTTP_STATUS.OK).send(success("Rating and Review added successfully",{FeedBack:addFeedback}));
      }

      return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to add Rating and review"));
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async removeRating(req, res) {
    try {
      const { userID, bookID } = req.body;
  
      const existingFeedback = await FeedBackModel.findOne({ userID, bookID });
  
      if (!existingFeedback) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Rating and review not found for this book.'));
      }
  
      if (existingFeedback.userID.toString() !== userID) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure('You are not authorized to remove this rating and review.'));
      }
       
      if (existingFeedback.rating== 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(failure('Rating is already removed'));
      }
      

      existingFeedback.rating = 0;
  
      await existingFeedback.save();
  
      
      
    const allFeedbacks = await FeedBackModel.find({ bookID: bookID });

    
    const feedbacks = allFeedbacks.filter(feedback => feedback.rating !== 0);

    
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;

      await BookModel.findByIdAndUpdate(bookID, { rating: averageRating });
  
      return res.status(HTTP_STATUS.OK).send(success('Rating removed successfully.'));
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
    }
  }
  

  async removeReview(req, res) {
    try {
      const { userID, bookID } = req.body;
  
      const existingFeedback = await FeedBackModel.findOne({ userID, bookID });
  
      if (!existingFeedback) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Rating and review not found for this book.'));
      }
  
      if (existingFeedback.userID.toString() !== userID) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure('You are not authorized to remove this rating and review.'));
      }
      if (existingFeedback.review== "null") {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(failure('Review is already removed'));
      }
      existingFeedback.review = "null";
  
      await existingFeedback.save();
  
    
      const allFeedbacks = await FeedBackModel.find({ bookID: bookID });

    
      const feedbacks = allFeedbacks.filter(feedback => feedback.review !== "null");
  
      if(feedbacks){
  
      return res.status(HTTP_STATUS.OK).send(success('Review removed successfully.'));
      }
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
      if(!review){
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure('Please provide your review to update the review.'));
      }
      existingFeedback.review = review;
  
      
      await existingFeedback.save();
      const feedbacks = await FeedBackModel.find({ bookID: bookID });
      const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
      const averageRating = totalRating / feedbacks.length;
      await BookModel.findByIdAndUpdate(bookID, { rating: averageRating });

  
      return res.status(HTTP_STATUS.OK).send(success('Rating and review updated successfully.'));
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
    }
  }

}

module.exports = new FeedBackController();
