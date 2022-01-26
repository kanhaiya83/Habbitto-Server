const mongoose = require('mongoose');


const { Schema } = mongoose;
require('dotenv').config(); 

// let connUri = process.env.NODE_ENV=="development" ?process.env.DEV_DB_URI:process.env.DB_URI;
let connUri=process.env.DEV_DB_URI || process.env.DB_URI
mongoose
  .connect(connUri, {
    useNewUrlParser: true,
    useUnifiedTopology:true
  })
  .then(() => {
    console.log("Connected to Mongoose");
  })
  .catch((err) => {
    console.log("Could not connect to mongoose;Error: ", err);
  });

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register

habitSchema = new Schema({
    userId:String,
    title: {type:String,required:true},
    isCompleted: {type:Boolean,required:true},
    // isReminderSet:{type:Boolean},
    repeatDays:{type:[Number],required:true},
    reminderTime: {type:String}
    
  });
  
  userSchema = new Schema({
    username: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    mobileNumber:{type:String}
  });
  

const UserModel = mongoose.model('User', userSchema);
const HabitModel = mongoose.model('Habit', habitSchema);





module.exports = {HabitModel,UserModel};
