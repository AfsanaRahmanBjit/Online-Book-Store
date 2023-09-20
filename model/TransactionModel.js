const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema(
{

   cartID:{
    type:mongoose.Types.ObjectId,
    ref:"carts",
    required:true,
   },
   userID:{
        type: mongoose.Types.ObjectId,
         ref: "users",
         required: true,
    },
    books:{
         type:[
             {
                 bookID:{
                 type:mongoose.Types.ObjectId,
                 ref:"books",
                 required:true,
              },
              quantity:Number,
              _id:false,
             },
         ],
        
     },
      total:{
        type:Number,
        required:true
    },
    paymentMethod: {
        type: String,
        required: true,
        default: "online",
    },

  } ,
  {timestamps:true}
);

const Transaction=mongoose.model("transactions",transactionSchema);
module.exports=Transaction;