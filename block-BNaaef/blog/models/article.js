var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const slugify = require('slugify')

var articleSchema = new Schema({
    title: {type:String, required:true},
    description: String,
    likes:{type:Number,default: 0},
    author:String,
    slug:{type: String, unique: true},
    comments:[{type:Schema.Types.ObjectId, ref: "Comment"}]
});

articleSchema.pre('save',function(next){
   if(this.title && this.isModified('title')){
     this.slug = slugify(this.title);
     return next()
   }
})


module.exports = mongoose.model('Article', articleSchema);