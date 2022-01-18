const passport=require("passport")
const LocalStrategy=require("passport-local").Strategy

const connection=require("./database")
const validPassword=require("./../lib/passwordUtils").validPassword

const User=connection.models.User

passport.use(
    new LocalStrategy(
        function(username,password,cb){
            User.findOne({username:username}).then((user)=>{
                    if(!user) {return cb(null,false)}
                    const isValid=validPassword(password,user.hash,user.salt) 
                    if(isValid){
                        console.log("Password is valid!!")
                        return cb(null,user)
                    }
                    else{
                        console.log("Password is not valid!!")
                        return cb(null,false)
                    }
            }).catch((e)=>{
                return cb(e) 
            })
        }
    )
)
passport.serializeUser((user,done)=>{
done(null,user.id)
})
passport.deserializeUser((userId,done)=>{
    User.findById(userId).then((user)=>{
    console.log("deserailize user : ",user)
    done(null,user)
    }).catch((e)=>{
        done(e)
    })
})