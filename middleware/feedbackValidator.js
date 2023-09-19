const { body } = require("express-validator");

const feedbackValidator = {
  add: [

    body("userID")
      .exists()
      .withMessage("Please provide an user ID")
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

    body("rating")
      .exists()
      .withMessage("Please provide a rating")
      .bail()
      .notEmpty()
      .withMessage("Rating cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Rating must be a numeric value")
      .bail()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),

    body("review")
      .exists()
      .withMessage("Please provide review")
      .bail()
      .notEmpty()
      .withMessage("Review cannot be empty")
      .bail()
      .isString()
      .withMessage("Review must be a string")
      .bail()
      .isLength({ max: 30 })
      .withMessage("Review cannot exceed 30 characters"),
  ],
  update: [
    body("userID")
    .exists()
    .withMessage("Please provide an user ID")
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
    .withMessage("User ID cannot be empty")
    .bail()
    .isMongoId()
    .withMessage("Book ID must be a valid MongoDB ObjectId"),

  body("rating")
    .optional()
    .isNumeric()
    .withMessage("Rating must be a numeric value")
    .bail()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("review")
    .exists()
    .withMessage("Please provide review")
    .bail()
    .notEmpty()
    .withMessage("Review cannot be empty")
    .bail()
    .isString()
    .withMessage("Review must be a string")
    .bail()
    .isLength({ max: 30 })
    .withMessage("Review cannot exceed 30 characters"),
  ],
};

module.exports = { feedbackValidator };
