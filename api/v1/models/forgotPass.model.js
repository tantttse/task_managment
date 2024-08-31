const mongoose=require("mongoose");

const forgotPassSchema= mongoose.Schema({
    email:String,
    otp:String,
    expiredAt:{
        type:Date,
        expires: 0
    }
},{
    timestamps:true
});

const ForgotPass=mongoose.model("ForgotPass",forgotPassSchema,"forgot_password");
// ModelName/Schema/TableName

module.exports = ForgotPass;