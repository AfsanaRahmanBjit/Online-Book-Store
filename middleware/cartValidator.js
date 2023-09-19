const { body } = require("express-validator");

const cartValidator = {
  add: [
    body("userID")
      .exists()
      .withMessage("Please provide a user ID")
      .bail()
      .notEmpty()
      .withMessage("User ID cannot be empty")
      .bail()
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ObjectId"),

    body("bookID")
      .exists()
      .withMessage("Please provide a book ID")
      .bail()
      .notEmpty()
      .withMessage("Book ID cannot be empty")
      .bail()
      .isMongoId()
      .withMessage("Book ID must be a valid MongoDB ObjectId"),

    body("quantity")
      .exists()
      .withMessage("Please provide a quantity")
      .bail()
      .notEmpty()
      .withMessage("Quantity cannot be empty")
      .bail()
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
  ],
  
};

module.exports = { cartValidator };
