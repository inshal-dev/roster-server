 const mongoose = require("mongoose");
 
 const userSchema = new mongoose.Schema({
    username: String,
    email: String
 })

 const User = mongoose.model('users', userSchema);

 module.exports = User;