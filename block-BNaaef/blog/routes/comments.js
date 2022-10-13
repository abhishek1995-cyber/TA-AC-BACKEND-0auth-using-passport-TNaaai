var express = require('express');
var router = express.Router();

var Article = require('../models/article');
var Comment = require('../models/comment');


router.get('/:id/edit', function(req, res, next) {
    var id = req.params.id;
    Comment.findById(id,(err,comment)=>{
      if (err) return next(err);
      res.render('updatecomment',{comment})
    })
  });

  router.post('/:id/edit',(req,res)=>{
    var id = req.params.id;
    Comment.findByIdAndUpdate(id,req.body,(err,updatedcomment)=>{
        if (err) return next(err);
        res.redirect('/articles/' + updatedcomment.articleId)
    })
})

router.get('/:id/delete',(req,res,next)=>{
    var commentid = req.params.id;
    Comment.findByIdAndDelete(commentid,(err,deletedcomment)=>{
        if (err) return next(err);
        Article.findByIdAndUpdate(deletedcomment.articleId,{$pull:{comments: deletedcomment._id}},(err,event)=>{
            if (err) return next(err);
            res.redirect('/articles/' + deletedcomment.articleId )
        })
    })
})


module.exports = router;