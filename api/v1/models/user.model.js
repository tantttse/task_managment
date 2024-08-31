const mongoose=require("mongoose");
const generateHelper=require("../../../helpers/generate")

const userSchema= mongoose.Schema({
    fullName:String,
    email:String,
    password:String,
    token:{
        type:String,
        default:generateHelper.generateRandomString(30)
    },
    deleted:{
        type:Boolean,
        default:false
    },
    deleteAt: Date
    },
    {
        timestamps:true
    }
)

const User=mongoose.model("User",userSchema,"users");

module.exports = User;