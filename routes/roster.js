const RosterData = require('../schemas/userSchema');


exports.userRoster = async(req, res) => {

    try{
        const data = {
            userId: req.body.userId,
            currentMonth: req.body.currentMonth,
            roster: req.body.monthData 
        };
        console.log(data);

        const rosterData = RosterData.create(data)
        let status = 'User is added in database'
        res.send(status).status(200);
    }catch{
        res.send('Data not add').status(400)
    }
}