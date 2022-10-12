var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var User = require('../models/User')

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done)=>{
    console.log(profile, "profile")
    var userdata = {
        name: profile.displayName,
        username : profile.username,
        email: profile._json.email,
        photo: profile._json.avatar_url
    }
    console.log(userdata, "userdata")
    User.findOne({email: profile._json.email}, (err,user)=>{
        if(err) return done(err);
        console.log(user, "found user")

        if(!user){
            User.create(userdata, (err, addeduser)=>{
                if(err) return done(err);
                console.log(addeduser, "created user")

                return done(null, addeduser)
            })
        }
        done(null, user)
    })
}))

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser(function(id,done){
    User.findById(id,'name username email',(err,user)=>{
        done(err,user)
    })
})