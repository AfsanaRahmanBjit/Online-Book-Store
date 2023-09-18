const jsonwebtoken=require("jsonwebtoken");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../output/statements");
const { json } = require("express");


const isAuthorized=(req,res,next)=>{
 try {
    if(!req.headers.authorization){
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Unauthorized access"));
    }
    const jwt=req.headers.authorization.split(" ")[1];
    const validate=jsonwebtoken.verify(jwt,process.env.SECRET_KEY);
    if(validate){
        next();
    }
    else{
        throw new Error();
    }    
    } catch (error) {
        console.log(error);
        if(error instanceof jsonwebtoken.JsonWebTokenError){
            return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Please provide a valid token"));
        }
        if(error instanceof jsonwebtoken.TokenExpiredError){
            return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Token expired"));

        }
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Token expired"))
        
    }
};

const isAdmin = (req, res, next) => {
    try {
      
      const { role } = jsonwebtoken.decode(req.headers.authorization.split(" ")[1]);
      
      if (role == 1) {
        
        next();
      } else {
        
        return res.status(HTTP_STATUS.FORBIDDEN).send(failure("Unauthorized access."));
      }
    } catch (error) {
      console.log(error);
      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Token invalid."));
      }
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Token expired."));
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Token expired."));
    }
  };

  const isUser = (req, res, next) => {
    try {
      
      const { role } = jsonwebtoken.decode(req.headers.authorization.split(" ")[1]);
  
    
      if (role == 2) {
        
        next();
      } else {
        
        return res.status(HTTP_STATUS.FORBIDDEN).send(failure("Unouthorized access."));
      }
    } catch (error) {
      console.log(error);
      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Token invalid."));
      }
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Token expired."));
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Token expired."));
    }
  };

module.exports={isAuthorized,isAdmin,isUser};
