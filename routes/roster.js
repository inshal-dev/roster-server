const UserRoster = require('../schemas/userRosterSchema');
const RosterData = require('../schemas/userRosterSchema');
const mongoose = require('mongoose');
const User = require('../schemas/userSchema');


exports.userRoster = async(req, res) => { 
    try{ 
        let userId = req.body.userId
        let userName = req.body.userName
        let userRoster = req.body.monthData 
        let currentMonth = req.body.currentMonth  
        let previousData = await RosterData.findOneAndReplace({ userId: userId }, { userId: userId, username:userName, roster: userRoster, currentMonth: currentMonth})
     
        console.log(userName)
        if(previousData){ 
            console.log('Roster Updated');
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

exports.sendUserRoster = async(req, res) =>{
    try {
        const userId = req.body.userId; 
        const userRosterData = await RosterData.find({ userId: userId }); 
        if(userRosterData){
            res.send({rosterData: userRosterData}).status(200);
        }else{
            res.send({'response':'User data not found'}).status(200);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

exports.getAllUserRoster = async(req, res) =>{
    try{
        //write administrative logic  
        const userRostersData = await UserRoster.find(); 
        res.send(userRostersData).status(200);
    }catch(err){
        res.send(err).status(400);
    }
}
 