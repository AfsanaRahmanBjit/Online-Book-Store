const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    unique:[true,"There is another book with same Book Title"],
    required: [true, "Book Title was not provided"],
    maxLength: 30,
  },
  author:{
    type: String,
    required: [true, "Author name was not provided"],
    maxLength: 20,
  },
  publisher:{
    type: String,
    required: [true, "Publisher name was not provided"],
    maxLength: 20,
  },
  price: {
    type: Number,
    required:[true, "Price of the book is not provided"],
    default:10,
    min:10,
  },
  stock: {
    type: Number,
    required:[true, "Stock of the book is not provided"],
    default: 0,
    min: 0,
    max: 200,
  },
  rating: {
    type: Number,
    default: 0,     
    max: 5,     
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: "feedbacks",
    },
  ],
  discounts: [
    {
      type:mongoose.Types.ObjectId,
      ref:"discounts"
    }
  ],
 },
  {timestamps:true}
);
const Book = mongoose.model("books", bookSchema);
module.exports = Book;