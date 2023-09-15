const mongoose=require("mongoose");

const authSchema=new mongoose.Schema(
  {
    email:{
        type:String,
        required:[true,"Email is not provide"]

    },
    password:{
        type:String,
        required:[true,"Password is not provide"]

    },
    role:
    {
        type:Number,
        required:false,
        default:2
    },
     verified:{
         type:Boolean,
         required:[true,"Varification Status is not provide"],
         default:false,
     },
    userID:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:[true,"User ID is not provide"]
    },
 },
 {timestamps:true}

);
const Auth = mongoose.model("authentications",authSchema );
module.exports = Auth;