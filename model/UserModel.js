const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is not provided"],
    maxLength: 30,
  },
  email: {
    type: String,
    required:[true,"Email is not provide"],
    unique: true,
    match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Please provide a valid email address",
    ],
  },
  phone: {
    type: String,
    required: [true,"Phone number is not provide"],
  },
  balance: {
    type: Number,
    required:[true,"Balance is not provide"],
    default: 0,
    min: 0,
    max: 100000,
  },

  role:
    {
        type:Number,
        required:false,
        default:2
    },
  verified: {
    type: Boolean,
    required: [true,"Varification Status is not provide"],
    default: false,
},
},
{timestamps:true}
);
const User = mongoose.model("users", userSchema);
module.exports = User;

