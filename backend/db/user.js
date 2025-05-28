const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,

});

const UserAuth=mongoose.model('userauth', userSchema);
module.exports = UserAuth;