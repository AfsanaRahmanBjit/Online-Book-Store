const { validationResult } = require("express-validator");
const { success, failure } = require("../output/statements");
const CartModel = require("../model/CartModel");
const BookModel = require('../model/BookModel');
const DiscountModel = require('../model/DiscountModel');
const UserModel = require('../model/UserModel');
//const TransactionModel=require('../model/Transaction');
const HTTP_STATUS = require("../constants/statusCodes");

class CartController{
    // async getAll(req,res){
    //     try {
    //         const carts = await CartModel.find({});
    //         if (carts.length > 0) {
    //           return res
    //             .status(HTTP_STATUS.OK)
    //             .send(success("Successfully received all carts", { total:carts.length ,result: carts}));
    //         }
    //         return res.status(HTTP_STATUS.OK).send(success("No carts were found"));
    //       } catch (error) {
    //         console.log(error);
    //         return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    //       }
    // }
    
     async getByID(req,res){
         try {
             const {cartID} = req.body;

             const cart = await CartModel.findById(cartID);
             if (cart.length > 0) {
               return res
                 .status(HTTP_STATUS.OK)
                 .send(success("Successfully received the cart", {cart: cart}));
            }
            return res.status(HTTP_STATUS.OK).send(success("No cart was found"));
          } catch (error) {
             console.log(error);
             return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
           }
     }

    async add(req,res){
        try {
            const validation = validationResult(req).array();
             if (validation.length > 0) {
                return res.status(HTTP_STATUS.OK).send(failure("Failed to add book to cart", validation));
             }
            const{userID,bookID,quantity}=req.body;
            
            const userFind = await UserModel.findById(userID);
            if (!userFind) {
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Please sign up to create an account"));
            }
            const bookFind = await BookModel.findById(bookID);
            if (!bookFind) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("There is no book exist with the given bookID"));
              }
            if (bookFind.stock < quantity) {
                
                return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Not enough books are in stock"));
            }
            const now = new Date();
            const validDiscount = await DiscountModel.findOne({
                book: bookID,
                startDate: { $lte: now },
                endDate: { $gte: now },
              });

            const discountedPrice = validDiscount
              ? (book.price * (100 - validDiscount.discountPercentage)) / 100
              : book.price;
        
            const cartItem = {
                bookID,
                quantity,
                price: discountedPrice
              };
            let message=" A Book is added in your existing cart"; 
            const cartFind = await CartModel.findOne({ userID });

            if (!cartFind) {
            cart = new Cart({
             userID,
             books: [cartItem],
             });
             message="A new cart is created for you and a book is added in your cart "
             } 
             else {
             
               const existingBookIndex = cart.books.findIndex((item) => item.bookID == bookID);

               if (existingBookIndex !== -1) {
       
               cart.books[existingBookIndex].quantity += quantity;
               } else {
        
               cart.books.push(cartItem);
      }
    }

    
      cart.total = cart.books.reduce(
      (total, item) => total + item.quantity * item.bookID.price,
      0
      );
     cart.checkout=false;
  
    await cart.save();

    return res.status(HTTP_STATUS.OK).send(success(message, {cart:cart} ));

            
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));  
            
        }
    }
   
    async deletebyID(req,res){
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
              return res.status(HTTP_STATUS.OK).send(failure("Failed to remove book from the cart", validation));
             }

             const user = await UserModel.findById({ _id: userId });

             if (!user) {
                 return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
             }
 
            const { userID, bookID ,quantity} = req.body;
            const cart = await CartModel.findOne({userID});
            if (!cart) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Cart not found for this user"));
            }
            if(isNaN(cart.total)||cart.total==0){
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No book was found to delete"));   
            }
            
            const existingBookIndex = cart.books.findIndex(item => item.bookID.toString() == bookID);
             if (existingBookIndex == -1) {
             return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Book is not found in the cart"));
              }
            
            const existingBook = cart.books[existingBookIndex];
            if (existingBook.quantity <quantity ) {
              return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Books do not exist in the cart enough times"));
            }
            if (existingBook.quantity > quantity) {
                existingBook.quantity -= quantity;
              } else {
               
                cart.books.splice(existingBookIndex, 1);
              }
          
              
              cart.total = cart.books.reduce(
                (total, item) => total + item.quantity * item.bookID.price,
                0
              );
          
            
              await cart.save();
          
            

        return res.status(HTTP_STATUS.OK).send(failure(`Book with ID ${bookID} deleted from cart successfully`, { cart: cart }));
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal Server Error"));
        }
    }
   
   


}
module.exports=new CartController();