 const User = require('../schemas/userSchema');

exports.userData = async (req, res) => {
  try{
    let user = {
      username: "Temp",
      email:'temp@sada.cin'
    }

    const userdata = User.create(user);
    res.send('user created')
   
}catch{
    res.status(400).send({error: "No task avaliable"})
}
 
}

exports.userInfo = async (req, res) =>{
  try{
    const user = await User.find();
    res.send(user)
  }catch{
    res.status(400).send({error: "No task avaliable"})
  }
}
