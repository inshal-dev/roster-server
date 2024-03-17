const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const rosterRouter = require('./routes/roster');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});
const port = process.env.PORT || 3000;
 
const AdminRoster = require('./schemas/adminRosterSchema')
const mongoose = require("mongoose");  
require("dotenv").config();

mongoose.connect(
    process.env.MONGODB_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
 ).then(() => {
    console.log('Database connection successful')
  })

app.use(cors({
    origin: '*'
}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Max-Age", "1800");
		res.setHeader("Access-Control-Allow-Headers", "content-type");
		res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS")
    next();
});

//$httpProvider.defaults.withCredentials = true;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', indexRouter.homePage);
app.get('/users',usersRouter.userData);
app.post('/user-login',usersRouter.userLogin)
app.get('/user-data',usersRouter.userInfo);
app.post('/current-roster', rosterRouter.userRoster) 
app.post('/user-check', rosterRouter.sendUserRoster)
app.post('/rosters', rosterRouter.getAllUserRoster)
app.post('/publish-roster', rosterRouter.publishRoster)
app.get('/create-user-rosters', rosterRouter.createRosterforAllUser)
app.post('/user-published-roster', rosterRouter.getPublishedRoterForUser)
//socket  
 
io.on('connection', (socket) => { 
    socket.on('userRosterUpdate', async (data) => { 
    // Step 1: Check if already object present of particular user
    // Step 2: If: true return updated the current value in it
    // Step 3: If: False : Create a new Object.  
    //sending modified data 
    
     const rosterPublished = await AdminRoster.find()
     //get length of Admin roster data 
     let lengthOfAdminRoster = rosterPublished.length 
    
  
    //creating new Object for new user Roster

    let newDataObject = {
      state:false, 
      month:data.roster[0].currentMonth,
      roster:data.roster, 
    }
 

    if(lengthOfAdminRoster == 0){ 
      const rosterCreate = await AdminRoster.create(newDataObject); 
      console.log('roster Created', rosterCreate)
      const modifiedRoster = rosterPublished.map(item => ({ 
        _id: item._id, 
        roster: item.roster.map(entry => ({
            _id: entry._id,
            userId: entry.userId,
            username: entry.username,
            currentMonth: entry.currentMonth,
            roster: entry.roster
        }),   )
  
    })); 
    io.emit('userRosterUpdate', `${socket.id.substr(0, 2)} said ${modifiedRoster}`);
    }else{   
      console.log(data._id);
      const rosterPublish = await AdminRoster.findByIdAndUpdate(data._id, {roster:data.roster});
     
      //console.log(rosterPublish)
    } 
   
   //   io.emit('userRosterUpdate', `${socket.id.substr(0, 2)} said ${modifiedRoster}`);
    });
  
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
    });
  });
  


  httpServer.listen(port, () => {
    console.log(`listening on port ${port}`)
  });

  // app.listen(()=>{
  //   console.log('Server is Up')
  // }, 3100)