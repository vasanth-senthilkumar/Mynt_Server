const express = require('express');
const { AuthenticatorJWT } = require('./authenticator');
const Chat = require('../Models/ChatModel');
const upload = require('./multer');
const cloudinary = require('./cloudinary');
const fs = require('fs');
const router = express.Router();




router.get('/getChats', async(req, res) => { 

    await Chat.find().populate('sender').exec((err, result) => {
        if(result) {
            return res.status(200).json({result});
        }
         else {
            return res.status(404).json({errorMessage: 'No Chats found'});
         }
    });
   
});
router.get('/ind-chat', async(req, res) => { 
      console.log(req.query.userId, req.query.receiverId);
       await Chat.find({"$or": [{"sender": req.query.userId, "receiver": req.query.receiverId}, {"sender": req.query.receiverId, "receiver": req.query.userId}]}).populate('sender').exec((error, result) => {
        if(error) {
            res.status(404).json({errorMessage: 'No Chats found'})
        }  else {
            res.status(200).json({result});
            // console.log(result);
        }
    })
    
   
});

router.post('/upload-image', upload.single('file'), async(req, res) => { 
    const { path } = req.file;
        const uploader = await cloudinary.uploads(path, 'ChatImagesOrVideos');
        fs.unlinkSync(path); 
     if(uploader) {
         return res.status(200).json(uploader);
     }   else {
         return res.status(400).json({errorMessage: 'error in file upload'});
     }
   
    
    
});


module.exports = router;