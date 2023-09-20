const { validationResult } = require("express-validator");
const { success, failure } = require("../output/statements");
const CartModel = require("../model/CartModel");
const BookModel = require('../model/BookModel');
const DiscountModel = require('../model/DiscountModel');
const UserModel = require('../model/UserModel');
const HTTP_STATUS = require("../constants/statusCodes");
const { log } = require('../server/logger');

class CartController{
    async getCart(req, res) {
      try {
          const { userID } = req.params;
          const user = await UserModel.findById({ _id: userID });
          if (!user) {
             
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
          }
          const cart = await CartModel.findOne({ userID: userID })
          .populate({
            path: "books.bookID",
            select: "-reviews -discounts -stock" 
        });

          if (!cart) {
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Cart does not exist for user"));
          }
         
          return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(success("Successfully got cart for user",{cart:cart}));
      } catch (error) {
          console.log(error);
          return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
      }
  }

     
     async addBookToCart(req,res){
      try {
          const validation = validationResult(req).array();
           if (validation.length > 0) {
              return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add book to cart", validation));
           }
          const{userID,bookID,quantity}=req.body;
          
          const user = await UserModel.findById(userID);
          if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Please sign up to create an account"));
          }
          const book = await BookModel.findById(bookID);
          if (!book) {
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("There is no book exist with the given bookID"));
            }
          if (book.stock < quantity) {
              
              return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Not enough books are in stock"));
          }
          const now = new Date();
          const validDiscount = await DiscountModel.findOne({
              bookID: bookID,
              startDate: { $lte: now },
              endDate: { $gte: now },
            });

          const discountedPrice = validDiscount
            ? (book.price * (100 - validDiscount.discountPercentage)) / 100
            : book.price;
          
          const cart = await CartModel.findOne({userID });
          if (!cart) {
            const newCart = await CartModel.create({
                userID: userID,
                books: [{ bookID: bookID, quantity, price: discountedPrice }],
                total: discountedPrice * quantity, 
            });
            
            if (newCart) {
                return res.status(HTTP_STATUS.CREATED).send(success("Added book to newly created cart", {cart:newCart}));
                
            }
        }
        const bookIndex = cart.books.findIndex((item) => item.bookID.toString() == bookID);
        if (bookIndex != -1) {
            if (book.stock < cart.books[bookIndex].quantity + quantity) {
                
                return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Not enough books are in stock"));
            }
            cart.books[bookIndex].quantity += quantity;
        } else {
            cart.books.push({ bookID: bookID, quantity, price: discountedPrice }); 
        }
        cart.total = cart.total + discountedPrice * quantity; 
        await cart.save();
        return res.status(HTTP_STATUS.OK).send(success("Added book to existing cart",{cart:cart}));
      
      } catch (error) {
          console.log(error);
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));  
          
      }
  }
   
    async removeBookFromCart(req, res) {
      try {
          const validation = validationResult(req).array();
          if (validation.length > 0) {
              return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to remove book from the cart", validation));
          }
  
          const { userID, bookID, quantity } = req.body;
          const user = await UserModel.findById(userID);
  
          if (!user) {
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
          }
  
          const cart = await CartModel.findOne({ userID });
          if (!cart) {
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Cart not found for this user"));
          }
  
          const book = await BookModel.findById(bookID);
  
          if (!book) {
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Book with ID was not found"));
          }
  
          if (isNaN(cart.total) || cart.total === 0) {
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No book was found to delete"));
          }
  
          
          const now = new Date();
          const validDiscount = await DiscountModel.findOne({
              bookID: bookID,
              startDate: { $lte: now },
              endDate: { $gte: now },
          });
  
          let discountedPrice = book.price; 
          if (validDiscount) {
              discountedPrice = (book.price * (100 - validDiscount.discountPercentage)) / 100;
          }
  
          const existingBookIndex = cart.books.findIndex((item) => item.bookID.toString() === bookID);
          if (existingBookIndex === -1) {
              return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Book is not found in the cart"));
          }
  
          const existingBook = cart.books[existingBookIndex];
          if (existingBook.quantity < quantity) {
              return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Books do not exist in the cart enough times"));
          }
  
          if (existingBook.quantity > quantity) {
              existingBook.quantity -= quantity;
          } else {
              cart.books.splice(existingBookIndex, 1);
          }
  
          
          const totalPriceToSubtract = discountedPrice * quantity;
  
          
          cart.total -= totalPriceToSubtract;
  
          await cart.save();
  
          return res.status(HTTP_STATUS.OK).send(failure(`Book with ID ${bookID} deleted from cart successfully`, { cart: cart }));
      } catch (error) {
          console.error(error);
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));
      }
  }
  

}
module.exports=new CartController();