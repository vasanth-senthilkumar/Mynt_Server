const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    cloudinary_id: {
        type: String,
        default: ''
    },
    sender : {
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'User', 
     },
     receiver : {
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'User', 
     },
   type: {
       type: String
   },
   timeOfSending: {
       type: String,
       required: true

   }
  
}, {timestamps: true}
);

const chatModel = new mongoose.model('Chat', chatSchema);
module.exports = chatModel;
