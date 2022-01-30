const express = require("express");
var cors = require("cors");
var path = require("path");

require("dotenv").config();

const userRoute = require("./routes/user.js");
const habitRoute = require("./routes/habits.js");

var app = express();

const port = process.env.PORT ||5000;


var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(userRoute);
app.use(habitRoute);

app.get("/images/:imageName",(req,res)=>{
  imageName=req.params.imageName
  res.sendFile(path.join(__dirname ,"public/images/"+imageName+".png"))
  
})

app.get("/",(r,res)=>{
  res.send("Habbitto Server")
})


app.listen(port, () => {
  console.log("App running on http://localhost:" + port);
});
