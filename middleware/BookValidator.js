const { body, query, param } = require("express-validator");


const bookValidator = {
  create: [
    body("title")
      .exists()
      .withMessage("Please provide book title")
      .notEmpty()
      .withMessage("Book title cannot be empty")
      .isString()
      .withMessage("Book title must be a string")
      .isLength({ max: 30 })
      .withMessage("Book title cannot exceed 30 characters"),
    body("author")
      .exists()
      .withMessage("Please provide author name")
      .notEmpty()
      .withMessage("Author name cannot be empty")
      .isString()
      .withMessage("Author name must be a string")
      .isLength({ max: 20 })
      .withMessage("Author name cannot exceed 20 characters"),

    body("publisher")
      .exists()
      .withMessage("Please provide publisher name")
      .notEmpty()
      .withMessage("Publisher name cannot be empty")
      .isString()
      .withMessage("Publisher name must be a string")
      .isLength({ max: 20 })
      .withMessage("Publisher name cannot exceed 20 characters"),

    body("price")
      .exists()
      .withMessage("Please provide the price of the book")
      .isNumeric()
      .withMessage("Price must be a numeric value")
      .isInt({min:0})
      .withMessage("Price must be greater than or equal to 0"),

    body("stock")
      .exists()
      .withMessage("Please provide the stock of the book")
      .isNumeric()
      .withMessage("Stock must be a numeric value")
      .isInt({ min: 0})
      .withMessage("Stock must be greater than or equal to 0"),
  ],
};

module.exports = { bookValidator };