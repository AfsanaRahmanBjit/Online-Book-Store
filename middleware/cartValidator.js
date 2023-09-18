const { body } = require("express-validator");

const cartValidator = {
  add: [
    body("userId")
      .exists()
      .withMessage("Please provide a user ID")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ObjectId"),

    body("bookId")
      .exists()
      .withMessage("Please provide a book ID")
      .isMongoId()
      .withMessage("Book ID must be a valid MongoDB ObjectId"),

    body("quantity")
      .exists()
      .withMessage("Please provide a quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
  ],
  
};

module.exports = { cartValidator };
