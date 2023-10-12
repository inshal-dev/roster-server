const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

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
    console.log('Database connection successful');
  })


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', indexRouter.homePage);
app.get('/users',usersRouter.userData);
app.get('/userdata',usersRouter.userInfo);
app.listen(3000, ()=>{
    console.log('Server is Up')
})
  
