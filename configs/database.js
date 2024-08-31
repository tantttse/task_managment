const mongoose = require("mongoose");

module.exports.connect = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("failed to connect to DB");
    }
}