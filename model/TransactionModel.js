const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema(
{

   cartID:{
    type:mongoose.Types.ObjectId,
    ref:"Cart",
    required:true,
   },
   userID:{
        type: mongoose.Types.ObjectId,
         ref: "User",
         required: true,
    },
    books:{
         type:[
             {
                 bookID:{
                 type:mongoose.Types.ObjectId,
                 ref:"Product",
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

const Transaction=mongoose.model("Transaction",transactionSchema);
module.exports=Transaction;