const { validationResult } = require("express-validator");
const { success, failure } = require("../output/statements");
const BookModel = require("../model/BookModel");
const HTTP_STATUS = require("../constants/statusCodes");

class BookController {
  async getAll(req, res) {
    try {
        const {page,limit,search,sortBy,sortOrder,filterField,filterStart,filterLimit}=req.query;
        

        // const pageNum = parseInt(page) || 1;
        // const limitNum = parseInt(limit) || 5;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        if(page && isNaN(pageNum)){

          return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Page must be a valid numbers"));
        }
        if(limit && isNaN(limitNum)){

          return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Limit must be a valid numbers"));
        }

        // if (isNaN(pageNum) || isNaN(limitNum)) {
        //   return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Page and limit must be valid numbers"));
        // }

        if (pageNum < 1 ||pageNum >100 ) { 
          return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Page must be between 1 and 100"));
        }

        if (limitNum < 1 || limitNum >5 ) { 
          return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Limit must be between 1 and 5"));
        }

        const pageNum_default=pageNum||1;
        const limitNum_default=limitNum||5;
        let query={};

         if (search) {
        //   const numeric=parseInt(search);
         
          // if (!isNaN(numeric)) {
          
          // query.$or= [
          //      { price: numeric}, 
          //      { stock: numeric },
          //     ];
          //      }
          query.$or = [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
                { publisher: { $regex: search, $options: "i" } },
              ];     
               };
        
       
        const sortOptions = {};
          if(sortBy && sortOrder){
             if(!['price','stock'].includes(sortBy)){
               return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid attribute to sort by"));
             }
            if (!['asc', 'desc'].includes(sortOrder)){
              return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid sorting order"));
            } 
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
            }
            if((!sortBy) && sortOrder)
            {
              return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Please provide the a attribute name which you want  to sort "));
            }
            if((sortBy) && (!sortOrder))
            {
              return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Please provide the sorting order "));
            }


          if (filterField && filterStart && filterLimit) {
            if(!['price','stock'].includes(filterField)){
              return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid attribute for filter out"));
            }
            const filterStartNum = parseInt(filterStart);
          
            if (isNaN(filterStartNum)) {
              return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid filter starting value"));
            }
          
            if(filterField==='discount'){
              if (filterLimit=== 'high') {
              query.discount = { $gte: filterStartNum };
             } 
            if (filterLimit === 'low') {
            query.discount = { $lte:filterStartNum };
            }
           
            }
          if(filterField==='price'){
             if (filterLimit=== 'high') {
              query.price = { $gte: filterStartNum };
             } 
            if (filterLimit === 'low') {
              query.price = { $lte:filterStartNum };
             }
          
          }
          if(filterField==='stock'){
            if (filterLimit=== 'high') {
            query.stock = { $gte: filterStartNum };
           } 
          if (filterLimit === 'low') {
          query.discount = { $lte:filterStartNum };
          }
         
          }
      
        }
        if((!filterField) && filterStart && filterLimit)
        {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Please provide the filter Field"));
        }
        if(filterField && (!filterStart) && filterLimit)
        {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Please provide the filter starting point"));
        }
        if(filterField && filterStart && (!filterLimit))
        {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Please provide the filter limit"));
        }

        if((!filterField) && (!filterStart) && filterLimit)
        {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Please provide the filter Field and filter starting point"));
        }
        if((filterField) && (!filterStart) && (!filterLimit))
        {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Please provide the filter starting point and filter limit "));
        }
        if((!filterField) && filterStart && (!filterLimit))
        {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Please provide the filter field  and filter limit "));
        }


        const books = await BookModel.find({});
        
        if(books.length<=0){
         
          return res.status(HTTP_STATUS.NOT_FOUND).send(success("No products were found"));
        }
      
        const booksPage = await BookModel.find(query,{createdAt:false,updatedAt:false}).sort(sortOptions).skip((pageNum_default-1)*limitNum_default).limit(limitNum_default);
      
        if (booksPage.length > 0) {
           return res.status(HTTP_STATUS.OK).send(success("Successfully received all Books", { Page:pageNum_default, Limit:limitNum_default, Total:books.length, Result:booksPage}));
          }
        return res.status(HTTP_STATUS.NOT_FOUND).send(success("No book was found with the provided criteria"));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async getOneById(req, res) {
    try {
      const { id } = req.params;
      const book= await BookModel.findById({ _id: id });
      if (book) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully received the book",  book));
      } 
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("There is no book exist with the given ID"));
      
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async add(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.OK).send(failure("Failed to add the book", validation));
      }

      const {title, author, publisher, price, stock} = req.body;
       const findBook=await BookModel.find({title:title,author:author});
       if(findBook.length>0){
         return res.status(HTTP_STATUS.CONFLICT).send(failure("There is already a book exist with same title and author"));
       }
    
      const book=await BookModel.create({
        title:title,
        author: author,
        publisher:publisher,
        price:price,
        stock:stock,

     });
      
     if(book){
          return res.status(HTTP_STATUS.OK).send(success("Successfully added the book", book));
        }
        
     return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add the book"));
        
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }
  async update(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to update the product", validation));
      }
  
      const { id } = req.params;
      const book = await BookModel.findById({ _id: id });
      if (!book) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("There is no book exist with the given book ID"));
      }
      
     
      const {title, author, publisher, price, stock} = req.body;
      
     
      const updatedBook = await BookModel.findByIdAndUpdate(
        id,
        { title, author, publisher, price, stock }, 
        { new: true }
      );
  
      if (updatedBook) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully updated the book data", updatedBook));
      } 
       return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to update the book data"));
      
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }



  async partialUpdate(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to update the product", validation));
      }
  
      const { id } = req.params;
      const book = await BookModel.findById({ _id: id });
      if (!book) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("There is no book exist with the given book ID"));
      }
      
      const updatedFields = {}; 
      
      if (req.body.title) {
        updatedFields.title = req.body.title;
      }
      if (req.body.author) {
        updatedFields.email = req.body.author;
      }
      if (req.body.publisher) {
        updatedFields.rank = req.body.publisher;
      }
      if (req.body.price) {
        updatedFields.discountPercentage = req.body.price;
      }
      if (req.body.stock) {
        updatedFields.discountPercentage = req.body.stock;
      }
     
      const updatedBook = await BookModel.findByIdAndUpdate(
        id,
        { $set: updatedFields }, 
        { new: true }
      );
  
      if (updatedBook) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully updated the book data", updatedBook));
      } 
       return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to update the book data"));
      
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }


  
  async deleteOneById(req, res) {
    try {
      const { id } = req.params;
      const findBook = await BookModel.findById({ _id: id });
      if(!findBook){
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("There is no book exist with the given ID"));
      }
    
      const book_dalete = await BookModel.findByIdAndDelete({ _id: id });
      if (book_dalete) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully deleted the book"));
      } 
      return res.status(HTTP_STATUS.OK).send(failure("Failed to delete the book"));
      
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }



  
}

module.exports = new BookController();