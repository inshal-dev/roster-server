const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const rosterRouter = require('./routes/roster');

const app = express();

const mongoose = require("mongoose");
const { log } = require('console');
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
app.get('/rosters', rosterRouter.getAllUserRoster)
app.listen(3000, ()=>{
    console.log('Server is Up')
})
  
