 const User = require('../schemas/userSchema');  
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 require('dotenv').config();
 
 
 exports.userRegister = async (req, res)=>{
  try {
      if(req.body.email != ''){
          req.body.password = await bcrypt.hash(req.body.password, 10);
          //create a user
          const user = await User.create(req.body);
          console.log(user._id)
          res.json(user);
      }
  }catch{
      res.status(400).json({error});
  }
}

exports.userLogin = async(req, res)=>{ 
        try{ 
            const user = await User.findOne({email: req.body.email});
            console.log(user);
            if(user){
                const pass = await bcrypt.compare(req.body.passwd, user.password)
                console.log(pass);
                
                if(pass){
                    console.log('Inpassword function')
                   // console.log(user._id ,process.env.JWT_TOKEN);
                    const token = await jwt.sign({_id: user._id}, process.env.JWT_TOKEN);
                    console.log(token);
                    res.json({ token: token, username: user.username, userId: user._id, admin: user.admin}).status(200);
                }else{
                    res.status(400).json({error: "Incorrect Password"});
                }
           }else{
            res.status(400).json({error: "User doesn't exist"});
           }
        }catch{
            res.status(400).json({error:'ERROR'});
        }
}




exports.userData = async (req, res) => {
  try{
    userPassword = await bcrypt.hash('zoheb@i', 10)
    console.log(userPassword)
    let user = {
      username: "Zoheb Waghu",
      email:'Zoheb@gmail.com',
      password: userPassword,
      admin:true  
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
