var express = require('express');
var router = express.Router();
var passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/failure',(req,res,next)=>{
  res.render('failure')
})

router.get('/success',(req,res)=>{
  res.render('success')
})

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: "/failure" }),(req,res)=>{
res.redirect('/success')
})

module.exports = router;
