const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
var cors = require("cors");

require("dotenv").config();

const routes = require("./routes");
const connection = require("./config/database");

var app = express();

const port = process.env.PORT || process.env.DEV_PORT;

//mongo store
const MongoStore = require("connect-mongo");

var corsOptions = {
  origin: [process.env.FRONTEND_URL, process.env.DEV_FRONTEND_URL,"http://localhost:5500"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//sesssion store setup

const sessionStore = MongoStore.create({ mongoUrl: process.env.DB_STRING });

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore, 
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, 
      domain:"localhost"
    },
  })
);
app.use((req, res, next) => {
  next();
});
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(port, () => {
  console.log("App running on http://localhost:" + port);
});
