const { body, query, param } = require("express-validator");


const bookValidator = {
  add: [
    body("title")
      .exists()
      .withMessage("Please provide book title")
      .bail()
      .notEmpty()
      .withMessage("Book title cannot be empty")
      .bail()
      .isString()
      .withMessage("Book title must be a string")
      .bail()
      .isLength({ max: 30 })
      .withMessage("Book title cannot exceed 30 characters"),

    body("author")
      .exists()
      .withMessage("Please provide author name")
      .bail()
      .notEmpty()
      .withMessage("Author name cannot be empty")
      .bail()
      .isString()
      .withMessage("Author name must be a string")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Author name cannot exceed 20 characters"),

    body("publisher")
      .exists()
      .withMessage("Please provide publisher name")
      .bail()
      .notEmpty()
      .withMessage("Publisher name cannot be empty")
      .bail()
      .isString()
      .withMessage("Publisher name must be a string")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Publisher name cannot exceed 20 characters"),

    body("price")
      .exists()
      .withMessage("Please provide the price of the book")
      .bail()
      .notEmpty()
      .withMessage("Price cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Price must be a numeric value")
      .bail()
      .isInt({min:0})
      .withMessage("Price must be greater than or equal to 0"),

    body("stock")
      .exists()
      .withMessage("Please provide the stock of the book")
      .bail()
      .notEmpty()
      .withMessage("Stock cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Stock must be a numeric value")
      .bail()
      .isInt({ min: 0})
      .withMessage("Stock must be greater than or equal to 0"),
  ],
  update: [
    body("title")
      .exists()
      .withMessage("Please provide book title")
      .bail()
      .notEmpty()
      .withMessage("Book title cannot be empty")
      .bail()
      .isString()
      .withMessage("Book title must be a string")
      .bail()
      .isLength({ max: 30 })
      .withMessage("Book title cannot exceed 30 characters"),
      
    body("author")
      .exists()
      .withMessage("Please provide author name")
      .bail()
      .notEmpty()
      .withMessage("Author name cannot be empty")
      .bail()
      .isString()
      .withMessage("Author name must be a string")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Author name cannot exceed 20 characters"),

    body("publisher")
      .exists()
      .withMessage("Please provide publisher name")
      .bail()
      .notEmpty()
      .withMessage("Publisher name cannot be empty")
      .bail()
      .isString()
      .withMessage("Publisher name must be a string")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Publisher name cannot exceed 20 characters"),

    body("price")
      .exists()
      .withMessage("Please provide the price of the book")
      .bail()
      .notEmpty()
      .withMessage("Price cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Price must be a numeric value")
      .bail()
      .isInt({min:10})
      .withMessage("Price must be greater than or equal to 10"),

    body("stock")
      .exists()
      .withMessage("Please provide the stock of the book")
      .bail()
      .notEmpty()
      .withMessage("Stock cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Stock must be a numeric value")
      .bail()
      .isInt({ min: 0})
      .withMessage("Stock must be greater than or equal to 0"),
  ],
  partialUpdate: [
    body("title")
      .optional() 
      .isString()
      .withMessage("Book title must be a string")
      .bail()
      .isLength({ max: 30 })
      .withMessage("Book title cannot exceed 30 characters"),

    body("author")
      .optional() 
      .isString()
      .withMessage("Author name must be a string")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Author name cannot exceed 20 characters"),

    body("publisher")
      .optional() 
      .isString()
      .withMessage("Publisher name must be a string")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Publisher name cannot exceed 20 characters"),

    body("price")
      .optional() 
      .isNumeric()
      .withMessage("Price must be a numeric value")
      .bail()
      .isInt({ min: 10 })
      .withMessage("Price must be greater than or equal to 10"),

    body("stock")
      .optional() 
      .isNumeric()
      .withMessage("Stock must be a numeric value")
      .bail()
      .isInt({ min: 0 })
      .withMessage("Stock must be greater than or equal to 0"),
  ],
  
  
};

module.exports = { bookValidator };