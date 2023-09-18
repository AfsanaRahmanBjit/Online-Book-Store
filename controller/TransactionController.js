//const { validationResult } = require("express-validator");
const { success, failure } = require("../output/statements");
const BookModel = require("../model/BookModel");
const UserModel = require('../model/UserModel');
const CartModel=require("../model/CartModel")
const TransactionModel = require("../model/");
const HTTP_STATUS = require("../constants/statusCodes");

class TransactionController {



   async checkout(req,res){
    try {
      const {cartID}=req.body;
      const cart=await CartModel.findById(cartID);
      if(!cart){
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No cart was found"));
      }
      
      const {userID, books, checkout}=cart;

      const Cartbooks = await Promise.all(books.map(async (bookItem) => {
        const { bookID, quantity } = bookItem;
        const book = await BookModel.findById(bookID);
        
        if (!book) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure("This book does not exist"));
        }

        if (book.stock<quantity) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send(failure(`Insufficient stock for book ${book.title}`));
        }
        const now = new Date();
        const validDiscount = await Discount.findOne({
          bookID: bookID,
          startDate: { $lte: now },
          endDate: { $gte: now },
        });

        const discountedPrice = validDiscount
          ? (book.price * (100 - validDiscount.discountPercentage)) / 100
          : book.price;

        // Update the book's stock
        book.stock -= bookItem.quantity;
        await book.save();

        return {
          bookID: bookItem.bookID,
          quantity: bookItem.quantity,
          price: discountedPrice,
        };
        
      })
      ); 
      const totalCost = Cartbooks.reduce(
        (sum, transaction) => sum + transaction.price * transaction.quantity,
        0
      );
      const user = await UserModel.findById(userID);
      if(user.balance<totalCost){
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Insufficient balance, please update your balance"));
      }
      user.balance-=totalCost;
      await user.save();
      const transactionData ={
        cart: cart.cartID,
        books: Cartbooks,
        total: totalCost,
        paymentMethod: "online", // You can set the payment method as needed
      };
      cart.checkout = true;
      await cart.save();

      const addTransaction=await TransactionModel.create(transactionData);
          if(addTransaction){
            return res.status(HTTP_STATUS.OK).send(success("Checkout Successful",{transaction:addTransaction,}));
           }
      else{
        return res.status(HTTP_STATUS.OK).send(success("Transaction can not be added"));
      }
    

      
    } catch (error) {
      console.log(error);
       return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }


   }
   async getAll(req, res) {

     try {
       const transactions = await TransactionModel.find({})
         .populate("user", "name email") 
         .populate("books.book", "title author publisher price")
         .populate("cart","total ")
         .select("-__v"); 
  
       if (transactions.length > 0) {
         return res.status(HTTP_STATUS.OK).send(success("Successfully received all transactions",{transactions:transactions,total:transactions.length}));
       } else {
         return res.status(HTTP_STATUS.OK).send(success("No transactions was found"));
       }
     } catch (error) {
       console.log(error);
       return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
     }
   }


  
 

  
 
}

module.exports = new TransactionController();