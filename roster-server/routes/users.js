const User = require('../schemas/userSchema');
const jwt_token = require('jsonwebtoken')
const bcrypt = require('bcryptjs'); 
exports.userAuth = async (req, res) =>{
  try{
    const user = await User.findOne({email: req.body.email});
    const validPassword = await bycrpt.compare(req.body.password, user.password)

    if (!user){
      return res.status(400).send("Invalid Email ID")
    }else if(!validPassword){
      return res.status(400).send('Incorrect password');
    }else{
      const token = jwt_token.sign({_id: user._id}, process.env.JWT_TOKEN) 
      res.status(200).header("auth_token", token).send(token)
    }

  }catch(error){
    res.status(500).send(error)
  }
}


exports.userData = async (req, res) => {
  try{
    console.log('User api')
    const crypt = await bcrypt.genSalt(10);
    const paswdCrypt = await bcrypt.hash(req.body.password, crypt)
    console.log(req.body.username);
    const user = {
      username: req.body.username,
      password: paswdCrypt
    }
    const userdata = await User.create(user);

    res.send(userdata)
  }catch{
      res.status(400).send({error: "Error while creating user"})
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
