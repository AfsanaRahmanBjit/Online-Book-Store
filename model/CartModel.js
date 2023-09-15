const mongoose=require("mongoose");

const cartSchema=new mongoose.Schema(
  {
     userID:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        require:true,
         },
     products:{
        type:[
             {
                productID:{
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
        default:0,
        required:true
    },
   checkout:{
      type:Boolean,
      default:false,
      require:true,
   },
  },
  {timestamps:true}

);

const Cart=mongoose.model("carts",cartSchema);
module.exports=Cart;