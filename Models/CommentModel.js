const mongoonse = require('mongoose');

const commentSchema = new mongoonse.Schema({
    user: {
        type: mongoonse.Schema.Types.ObjectId, 
        ref : 'User', 
        required: true
     },
    
     productId: {
      type: mongoonse.Schema.Types.ObjectId, 
      ref : 'Product', 
      required: true
   },
   
      responseTo: {
         type: mongoonse.Schema.Types.ObjectId
      
      },
   text: {
       type: String,
       required: true
   },
   rating: {
      type: Number
     },
   timeOfSubmit: {
      type: String,
   }
   
}, {timestamps: true}

);

const commentModel = new mongoonse.model('comment', commentSchema);

module.exports = commentModel;