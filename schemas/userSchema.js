 const mongoose = require("mongoose");
 
 const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password:String,
    admin:Boolean
    
 })

 const User = mongoose.model('users', userSchema);

 module.exports = User;