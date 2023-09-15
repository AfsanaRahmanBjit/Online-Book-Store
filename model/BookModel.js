const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    unique:[true,"There is another book with same Book Title"],
    required: [true, "Book Title was not provided"],
    maxLength: 50,
  },
  author:{
    type: String,
    required: [true, "Author name was not provided"],
    maxLength: 30,
  },
  publisher:{
    type: String,
    required: [true, "Publisher name was not provided"],
    maxLength: 30,
  },
  price: {
    type: Number,
    required:[true, "Price of the book is not provided"],
    default:1,
    min:1,
  },
  stock: {
    type: Number,
    required:[true, "Stock of the book is not provided"],
    default: 0,
    min: 0,
    max: 200,
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: "reviews",
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