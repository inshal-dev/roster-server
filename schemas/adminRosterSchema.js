const mongoose = require("mongoose"); 
const rosterSchema = new mongoose.Schema({  
   state:Boolean,
   month: String,
   roster:Array
})

const Roster = mongoose.model('Roster', rosterSchema);

module.exports = Roster;