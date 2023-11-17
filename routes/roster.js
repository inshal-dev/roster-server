const RosterData = require('../schemas/userRosterSchema');


exports.userRoster = async(req, res) => {

    try{
        // console.log(req.body.userId);
        // let previousData = await RosterData.findOneAndReplace({userId: req.body.userId })
        // console.log(previousData)
        
        const data = {
            userId: req.body.userId,
            currentMonth: req.body.currentMonth,
            roster: req.body.monthData 
        };
        console.log(data);

        const rosterData = await RosterData.create(data)
        console.log(rosterData);
        let status = {"response": 'User is added in database', data : rosterData}
        res.send(status).status(200);
    }catch(err){ 
        res.send(err).status(400)
    }
}