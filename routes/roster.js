const UserRoster = require('../schemas/userRosterSchema');
const RosterData = require('../schemas/userRosterSchema');
const AdminRoster = require('../schemas/adminRosterSchema');
const Users = require('../schemas/userSchema');
const User = require('../schemas/userSchema');
const moment = require('moment')
exports.userRoster = async(req, res) => { 
    try{ 
        let userId = req.body.userId
        let userName = req.body.userName
        let userRoster = req.body.monthData 
        let currentMonth = req.body.currentMonth  
        let previousData = await RosterData.findOneAndReplace({ userId: userId }, { userId: userId, username:userName, roster: userRoster, currentMonth: currentMonth})
     
        //console.log(userName)
        if(previousData){ 
            //console.log('Roster Updated');
            let status = {"response": "Roster Updated"}
            res.send(status).status(200)
        }else{
            console.log(userName)
            const data = {
                userId: userId, 
                username: userName,
                currentMonth: currentMonth,
                roster: userRoster 
            }; 
            const rosterData = await RosterData.create(data) 
            console.log('Roster Created');

            let status = {"response": 'User is added in database', data : rosterData}
            res.send(status).status(200);
        }
      
    }catch(err){ 
        res.send(err).status(400)
    }
}

//create all user rosters if no data is submitted
//write logic here
exports.createRosterforAllUser = async (req, res) => {
    try{
        const usersObject = await Users.find(); 
        const userRosterCheck = await UserRoster.find()

        //logic where admin user is remove using filter  
        const loopObject = usersObject.filter((item)=> item.admin ? '' : item)
        
       // console.log('Line:50', loopObject.length);
        //get all id from user created rosters
        let _idObject = []
        userRosterCheck.filter((id)=> {
           _idObject.push(id.userId) 
        })
        //console.log("Line: 53",_idObject)
        // continue write the logic for creating roster for all user via server.
        // Object = {
        //  _id, userId, username, currentMonth, roster   
        // }
        //Creating whole month object via moment.js
        months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const moments = moment().add(1, 'month');
        let days = [];
        const daysInMonth = moments.daysInMonth(); 
        const firstDay = moment(moments).startOf('month'); 
        for (let i = 1; i <= daysInMonth; i++) {
          const date = moment(firstDay).date(i);
          const day = {
            date,
            dayNumber: i,
            weekday: date.format('ddd'),
            option: null
          };
          days.push(day); 
         
        }   
        // adjusting with week format
        const firstDayOfWeek = moment(firstDay).day();
        for (let i = 0; i < firstDayOfWeek; i++) {
          days?.unshift(null);
        }
        
        //get currentMonth using moment.js
        currentMonths = months[moments.month()]  
        // console.log(currentMonths)
        //Check if user roster is already present or not

        //!!! Need to check the user _id Issue 
            
        loopObject.forEach(async (item, index) => {
            console.log('index:', index)
            let _id = loopObject[index]._id.toString();
            let rosterUserId = _idObject[index]
           // console.log('Line 83:',_id, rosterUserId)
            const idState = _idObject.find((item) => item == _id)
            if(idState){ 
                console.log('id state: ',idState)
                console.log('Line: 93: User is already present')
            }else{
                console.log('Not present create new')
                let userRosterData = {
                    userId: loopObject[index]._id.toString(),
                    username: loopObject[index].username,
                    currentMonth: currentMonths,
                    roster: days
                } 
                const createUserRoster = await UserRoster.create(userRosterData)
                console.log('Line: 91: User Rosters are created')
            }
        })
            

        //Rewriting creating user array logic  

         
       res.send(loopObject).status(200)
    }catch(err){
        console.log(err)
        res.send(err).status(400)
    }
}

exports.sendUserRoster = async (req, res) =>{
    try {
        const userId = req.body.userId; 
        const month = req.body.month;
        console.log(month);
        const userRosterData = await RosterData.find({ userId: userId, currentMonth:month  }); 
        console.log(userRosterData);
        if(userRosterData){
            res.send({rosterData: userRosterData}).status(200);
        }else{
            res.send({'response':'User data not found'}).status(200);
        }
    } catch (err) { 
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

exports.getAllUserRoster = async (req, res) =>{
    try{
        console.log('in try')
        const monthSelected = req.body.data
        //console.log(monthSelected);
        //write administrative logic  
        //console.log(monthSelected);
        const findAdmin = await Users.findOne({username: req.headers.id});
        
       if(findAdmin.admin){ 
            const rosterPublish = await AdminRoster.find({month: monthSelected}); 

        //    console.log('Check', rosterPublish);
            if (rosterPublish.length > 0) {
                // Modify the structure of the data before sending the response
                const modifiedRoster = rosterPublish.map(item => ({
                    _id: item._id,  
                    roster: item.roster.map(entry => ({
                        _id: entry._id,
                        userId: entry.userId,
                        username: entry.username,
                        currentMonth: entry.currentMonth,
                        roster: entry.roster
                    }))
                })); 
                res.send({ res: 'pre-published', data: modifiedRoster });
            }else{
                const userRostersData = await UserRoster.find({currentMonth: monthSelected});  
                res.send({res:'all-merged', data: userRostersData} ).status(200);
            }
 
        }else{
            res.send({res:'404'}).status(200)
        } 
         
    }catch(err){
        console.log(err)
        res.send(err).status(400);
    } 
}
 

exports.publishRoster = async(req, res) =>{
    try{
        const rosterObject = req.body.data;    
        const id = rosterObject._id;
        const monthRoster = { 
            state: true,
            month: rosterObject.roster[0].currentMonth,
            roster: rosterObject.roster
        }  
        //console.log(monthRoster); 
        if (rosterObject) {  
            const rosterPublish = await AdminRoster.findByIdAndUpdate(id, monthRoster, {new: true});
            res.send({res: 'Roster is published', data: rosterPublish}).status(200)
        }else{  
           // let publishRoster = await AdminRoster.create(monthRoster) 
          //  res.send({res: 'Roster is published', data: publishRoster}).status(200)
          res.send({res: 'Roster is already published'})
        }
    }catch(err){
        res.send(err).status(400)
    }
}


exports.getPublishedRoterForUser = async(req, res) => {

    try{
        const userId = req.body._id
        console.log(userId)
        if(userId){
            const userRoster = AdminRoster.findOne({_id: userId})
            console.log(userRoster)
            res.send({data:userRoster}).sendStatus(200);
        }else{
            console.log('User does not exist')
        }

    }catch(err){
        res.send(err).sendStatus(400)
    }

}
