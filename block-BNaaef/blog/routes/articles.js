var express = require('express');
var router = express.Router();
var User = require('../models/user')
var Article = require('../models/article');
var Comment = require('../models/comment');
const session = require('express-session');
var passport = require('passport')

router.get('/',(req,res,next)=>{

    Article.find({},(err,articles)=>{
        if(err) return next(err);
        res.render('articlesList',{articles: articles})
      })

})
 
router.get('/form',(req,res)=>{
        res.render('articlesform')
})

router.post('/form',(req,res,next)=>{
    Article.create(req.body,(err,createdaarticle)=>{
        if(err) return next(err);
        res.redirect('/articles')
    })
})

router.get('/:slug',(req,res)=>{
 
    var link = req.params.slug;
    Article.findOne({slug:link}).populate('comments').exec((err,article)=>{
        if (err) return next(err);
    res.render('articledetails',{article})
    })

})

// increment likes
router.get('/:slug/likes',(req,res,next)=>{

    var link = req.params.slug;
    Article.findOneAndUpdate({slug:link},{$inc: {likes: 1}},(err,article)=>{
        if (err) return next(err);
    res.redirect('/articles/' + link)
    })

})

// edit

router.get('/:slug/edit',(req,res,next)=>{

    var link = req.params.slug;
    Article.findOne({slug:link},(err,article)=>{
        if (err) return next(err);
        res.render('editarticle',{article})
    })
    
})

router.post('/:slug/edit',(req,res)=>{
    var link = req.params.slug;
    Article.findOneAndUpdate({slug:link},req.body,(err,updatedarticle)=>{
        if (err) return next(err);
        res.redirect('/articles/' + link)
    })
})

router.get('/:slug/delete',(req,res)=>{

        var link = req.params.slug;
        Article.findOneAndDelete({slug:link},(err,article)=>{
            if (err) return next(err);
            Comment.deleteMany({articleId: article.link},(err,info)=>{
                if (err) return next(err);
                res.redirect('/articles' )
            })
        })
    
})


// add comments

// router.post('/:slug/comments',(req,res,next)=>{
//     var link = req.params.slug;
//     req.body.articleId = link;
//     Comment.create(req.body,(err,comment)=>{
//         console.log(comment)
//       if (err) return next(err);
//       Article.findOneAndUpdate({slug:link},{$push : { comments: comment._id}}, (err,updatedarticle=>{
//         if (err) return next(err);
//         res.redirect('/articles/'+ link)
//       })
//       )
//     })
//   })

  router.post('/:slug/comments',(req,res,next)=>{
    var link = req.params.slug; 
    Comment.create(req.body,(err,comment)=>{
        req.body.articleId = comment.article;
      if (err) return next(err);
      Article.findOneAndUpdate({slug:link},{$push : { comments: comment._id}}, (err,updatedarticle)=>{
        if (err) return next(err);
        res.redirect('/articles/'+ link)
      })
      
    })
  })



module.exports = router;