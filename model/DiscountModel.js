const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
      required: true,
    },
    discountPercentage: {
        type: Number,
        required: false, 
        min: 0,
        max: 100, 
      },
      startDate: {
        type: Date,
        required: false, 
      },
      endDate: {
        type: Date,
        required: false, 
      },
  },
  { timestamps: true }
);

const Discount= mongoose.model("discounts", discountSchema);
module.exports = Discount;