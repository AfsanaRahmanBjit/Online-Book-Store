const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bookID: {
      type: mongoose.Types.ObjectId,
      ref: "books",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default:0,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FeedBack= mongoose.model("feedbacks", feedbackSchema);
module.exports = FeedBack;