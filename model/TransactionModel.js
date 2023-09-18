const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema(
{

   card:{
    type:mongoose.Types.ObjectId,
    ref:"Cart",
    required:true,
   },
   user:{
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
        require:true
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