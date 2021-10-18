const mongoonse = require('mongoose');

const disLikeSchema = new mongoonse.Schema({
   userId : {
      type: mongoonse.Schema.Types.ObjectId, 
      ref : 'User', 
   },
     commentId: {
        type: mongoonse.Schema.Types.ObjectId, 
        ref : 'Comment', 
     },
     productId: {
      type: mongoonse.Schema.Types.ObjectId, 
      ref : 'Product',
   },
   
}, {timestamps: true}

);

const disLikeModel = new mongoonse.model('Dislike', disLikeSchema);

module.exports = disLikeModel;