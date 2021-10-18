const express = require('express');
const Like = require('../Models/LikeModel');
const Dislike = require('../Models/DislikeModel');
const { AuthenticatorJWT } = require('./authenticator');

const router = express.Router();


router.get('/get-likes', async(req, res) => {
    let variable = {};
    if(req.query.productId) {
        variable = { productId: req.query.productId}
    } else {
        variable = { commentId: req.query.commentId}
    }
    // find({"$and": [{"productId": req.query.productI}, {"commentId": req.query.commentId}]})
    Like.find({"$and": [{"productId": req.query.productId}, {"commentId": req.query.commentId}]}).exec((error, likes) => {
        if(error) {
            res.status(404).json({errorMessage: 'No Likes found'})
        }  else {
            res.status(200).send({likes});
        }
    })
    
})


router.get('/get-dislikes', async(req, res) => {
    let variable = {};
    if(req.query.productId) {
        variable = { productId: req.query.productId}
    } else {
        variable = { commentId: req.query.commentId}
    }
    Dislike.find({"$and": [{"productId": req.query.productId}, {"commentId": req.query.commentId}]}).exec((error, dislikes) => {
        if(error) {
            res.status(404).json({errorMessage: 'No dislikes found'})
        }  else {
            res.status(200).send({dislikes});
        }
    })
    
})


router.post('/uplike', AuthenticatorJWT, async(req, res, next) => {
    const like = new Like({
        productId: req.body.productId, 
        userId : req.user._id,
        commentId: req.body.commentId
    });
    like.save((error, likeResult) => {
        if(error) {
            res.status(404).send({errorMessage: 'unable to save like'});
        } 
    
       Dislike.findOne({productId: req.body.productId, commentId: req.body.commentId, userId: req.user._id}).exec((error, result) => {
         if(error) res.status(400).send({errorMessage: 'Failed to delete dislikes'});
          result && result.remove();
          res.status(200).send({successMessage: 'deleted',});
      });
      
    })
    
})


router.put('/unlike', AuthenticatorJWT,  async(req, res) => {
   
    Like.findOneAndDelete({productId: req.body.productId, commentId: req.body.commentId, userId: req.user._id}).exec((error, likes) => {
            if(error) res.status(400).json({errorMessage: 'Failed to delete dislikes'});
            else {
                res.status(200).send(likes);
            }
    })
    
}) 


router.post('/updislike', AuthenticatorJWT, async(req, res) => {

    // console.log(req.body.productId, req.body.commentId)


    // let variable = {};
    // if(req.body.productId) {
    //     variable = { productId: req.body.productId, userId : req.user._id}
    // } else {
    //     variable = { commentId: req.body.commentId, userId : req.user._id}
    // }

    const dislike = new Dislike({
        productId: req.body.productId, 
        userId : req.user._id,
        commentId: req.body.commentId
    });

    dislike.save((error, DisLikeResult) => {
        if(error) {
            res.status(404).json({errorMessage: 'unable to save dislike'})
        } 
        Like.findOneAndDelete({productId: req.body.productId, commentId: req.body.commentId, userId: req.user._id}).exec((error, likes) => {
            if(error) res.status(400).json({errorMessage: 'Failed to delete dislikes'});
            else {
                res.status(200).send(likes);
            }
    })
    })
    
})

 
router.put('/undislike', AuthenticatorJWT,  async(req, res) => {
   
    Dislike.findOneAndDelete({productId: req.body.productId, commentId: req.body.commentId, userId: req.user._id}).exec((error, dislike) => {
            if(error) res.status(400).json({errorMessage: 'Failed to delete dislikes'});
            else {
                res.status(200).send({dislike});
            }
    })
    
})





module.exports = router;