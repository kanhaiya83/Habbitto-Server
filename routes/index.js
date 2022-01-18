const router = require('express').Router();
const passport = require('passport');
const connection = require('../config/database');
const User = connection.models.User;
var  genPassword= require('./../lib/passwordUtils').genPassword;

/**
 * -------------- POST ROUTES ----------------
 */
 // TODO
 router.post('/login', passport.authenticate("local"),(req,res)=>{
    res.send({authenticated:true})
});

 // TODO
 router.post('/register', (req, res, next) => {
     const saltHash=genPassword(req.body.password)
     const salt=saltHash.salt
     const hash=saltHash.genHash
     console.log(hash)
     const newUser=new User({
         username:req.body.username,
         hash:hash,
         salt:salt
     })
     newUser.save().then((user)=>{
         return res.send(JSON.stringify(user))
     })


 });
 let str2="";
for (let i = 0; i < str.length; i++) {
if(str[i]!=" "){
    str2+=str
}
    
}
 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res) => {
    if(req.isAuthenticated()){

        res.status(200).send({"response":"true"})
    }
    else{
        res.status(302).send("not authenticated")
    }
});


/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', (req, res, next) => {
    
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;