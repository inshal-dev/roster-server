const mongoose = require("mongoose");
 
const userRosterSchema = new mongoose.Schema({ 
   userId: String,
   currentMonth:String,
   roster:Array,
})

const UserRoster = mongoose.model('usersRoster', userRosterSchema);

module.exports = UserRoster;