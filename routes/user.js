const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const router = express.Router();




const passwordUtils = require("../utils/passwordUtils");
const { UserModel } = require("../config/database");
const verifyJWT = require("../middlewares/verifyJWT");



router.post("/signup", async (req, res) => {
  //check if password is longer than 6 characters
  if (req.body.password.length < 6) {
    return res.status(400).send({success:false,message:"Enter a valid password"});
  }
  //check if a user with same username already exists
  duplicateUsername = await UserModel.findOne({ username: req.body.username });
  if (duplicateUsername) {
    return res.status(400).send({success:false,message:"The username already exists"});
  }

  const {hash,salt}=passwordUtils.genHashAndSalt(req.body.password)

  //saves the username and password in database
  const newUser = new UserModel({
    username: req.body.username,
    hash: hash,
    salt:salt,
    mobileNumber:req.body.mobileNumber
  });
  try {
    const savedUser = await newUser.save();
console.log({savedUser})
    const jwtPayload = {
        userId: savedUser.id,
    };
    const authToken = await jwt.sign(jwtPayload, process.env.JWT_SECRET);

    res.send({success:true, authToken });
  } catch (e) {
    return res.status(500).send({ success:false,message:"Some Error occured",error: e });
  }
});

router.post("/login", async (req, res) => {try{
  const { username, password } = req.body;

  const user =await  UserModel.findOne({ username: username });
  if (!user) {
    return res
      .status(400)
      .send({
        success:false,
        error: "some error occurred",
        message: "No user found with given username",
      });
  }
  const isValidPassword=passwordUtils.validatePassword(password,user.hash,user.salt)
  if(!isValidPassword){
      
    return res
    .status(400)
    .send({
success:false,
      error: "some error occurred",
      message: "Enter a valid password",
    });
  }
  
  const jwt_payload={
          userId:user.id
  }

  const authToken=jwt.sign(jwt_payload,process.env.JWT_SECRET)
  return res.send({success:true,authToken})}

catch(e){
res.status(500).send()
}})

router.get("/test",verifyJWT,(r,res)=>{
    console.log(r.userId);
    
})


// router.get("/getuser",require("../middleware/fetchUser"),async (req,res)=>{
//    userId=req.user.id
//   try{
//     const userFound=await UserModel.findById(userId).select("-password")
//     let a=userFound.username
//     console.log(a)
//     if(userFound){
//     return res.send({username:userFound.username,success:true})}
//     else{
//       return res.status(404).send({success:false,message:"No user found"})
//     }
//   }
//   catch(e){
//     console.log(e)
//      return res.status(500).send({error:e.message,success:false,message:"Some error occurred while finding user"})
//   }
// })

module.exports = router;
