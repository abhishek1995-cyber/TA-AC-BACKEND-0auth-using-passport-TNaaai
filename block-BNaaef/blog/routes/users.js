var express = require('express');
var router = express.Router();
var User = require('../models/user')
var Article = require('../models/article')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  res.render('articles')
});

router.get('/register',(req,res,next)=>{
  res.render('register')
})
router.get('/login',(req,res)=>{
  res.render('login')
})
router.post('/register',(req,res,next)=>{
  User.create(req.body,(err,user)=>{
    console.log(user);
    if (err) return next(err);
    res.redirect('/users/login')
  })
})

router.post('/login',(req,res,next)=>{
  var {email,password} = req.body;
  if(!email || !password){
   return res.redirect('/users/login')
  }
  User.findOne({email},(err,user)=>{
    if (err) return next(err);
    // no user
    if(!user){
     return res.redirect('/users/login')
    }
    // compare password
    user.verifyPassword(password,(err,result)=>{
      if (err) return next(err);
      if(!result){
        return res.redirect('/users/login')
       }
       // persist loggedin user information
      req.session.userId = user.id;
      return res.redirect('/articles/form')
    })
  })
})
module.exports = router;
