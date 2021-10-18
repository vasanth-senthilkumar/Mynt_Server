const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
   userId : {
      type: mongoose.Schema.Types.ObjectId, 
      ref : 'User', 
   },
     commentId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'Comment', 
        
     },
     productId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref : 'Product', 
      
   },
   
}, {timestamps: true}

);

const LikeModel = new mongoose.model('Like', likeSchema);

module.exports = LikeModel;