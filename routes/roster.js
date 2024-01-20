const UserRoster = require('../schemas/userRosterSchema');
const RosterData = require('../schemas/userRosterSchema');
const AdminRoster = require('../schemas/adminRosterSchema')
const Users = require('../schemas/userSchema')
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
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

exports.getAllUserRoster = async(req, res) =>{
    try{
        //write administrative logic  
        console.log(req.headers.authorization)
        const findAdmin = await Users.findById({_id: req.headers.id});
        console.log(findAdmin);  
        if(findAdmin.admin){
            const rosterPublish = await AdminRoster.find(); 
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
                const userRostersData = await UserRoster.find();  
                res.send({res:'all-merged', data: userRostersData} ).status(200);
            }
        }else{
            res.send({res:'404'}).status(200)
        }
        
         
    }catch(err){
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
        console.log(monthRoster); 
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

