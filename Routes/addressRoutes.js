const express = require('express');
const  mongoose = require('mongoose');
const Address = require('../Models/addressModel');
// var ObjectID = require('mongodb').ObjectID;

const router = express.Router();



router.get('/get/:id', async (req, res) => {
    const findAddresses = await Address.find({userId: req.params.id});
    if(findAddresses) {
        res.status(200).json(findAddresses);
    } else {
        res.status(404).json({errorMessage: 'No Addresses Found'});
    }
});


router.get('/getIndById', async (req, res) => {
    const addId = req.query.addId;
    const userId = req.query.userId;
    console.log(addId, userId);
    const getUser = await Address.findOne({userId: userId});
   const getAddress =  await getUser.allAddresses.filter(c => c.address ===addId);
    if(getAddress) {
        res.status(200).json(getAddress);
    } else {
        res.status(404).json({errorMessage: 'No Addresses Found'});
    }
});




router.post('/post', async(req, res) => {
    var newObjectId = new mongoose.mongo.ObjectId();
    const {userId, name, city, pinCode, town, address, state, mobile, defaultAddress, sunday, saturday, home, work} = req.body;
    Address.findOne({userId: userId}).exec((error, result) => {
        if(error) return res.status(400).json({error});
        if(result) {
          const item = result.allAddresses.find(c => c.address === address);
          if(item) {
              Address.findOneAndUpdate({"userId": userId, "allAddresses.address" : address}, {
                  "$set": {
                      "allAddresses.$" : {
                          ...req.body,
                          name, 
                            city, 
                            pinCode, 
                            town, 
                            address, 
                            state, 
                            mobile, 
                            defaultAddress, 
                            sunday,  
                            saturday, 
                            home, 
                            work,
                      }
                  }
              })
              .exec((error, newResult) => {
                if(error) return res.status(400).json({error})
                if(newResult) {
                 return res.status(200).json({newResult});
                }

          });

        }  else {
         
          Address.findOneAndUpdate({userId: userId}, {
              "$push": {
                  "allAddresses": req.body
              }
          }).exec((error, newAddress) => {
              if(error) return res.status(400).json({error});
              if(newAddress) {
                  return res.status(200).json({newAddress});
              }
          })
        }

      }  
         else {
            Address.create({
              userId: userId,
              allAddresses: [{
                 name, 
                 city, 
                 pinCode, 
                 town, 
                 address, 
                 state, 
                 mobile, 
                 defaultAddress, 
                 sunday, 
                 saturday, 
                 home, 
                 work
              }]
             
      });
      res.status(200).json({successMessage: 'Address created successfuly!'});    
         
      }
    });

  
});


router.post('/edit/:id', async(req, res) => {
    const addId = req.params.id;
    const userId = req.body.userId;
    const {name, city, pinCode, town, address, state, mobile, defaultAddress, sunday, saturday, home, work} = req.body;
    Address.findOne({userId: userId}).exec((error, result) => {
        if(error) return res.status(400).json({error});
        if(result) {
          const item = result.allAddresses.find(c => c.address === addId);
          if(item) {
              Address.findOneAndUpdate({"userId": userId, "allAddresses.address" : addId}, {
                  "$set": {
                      "allAddresses.$" : {
                          ...req.body,
                            name, 
                            city, 
                            pinCode, 
                            town, 
                            address, 
                            state, 
                            mobile, 
                            defaultAddress, 
                            sunday,  
                            saturday, 
                            home, 
                            work,
                      }
                  }
              })
              .exec((error, newResult) => {
                if(error) return res.status(400).json({error})
                if(newResult) {
                 return res.status(200).json({newResult});
                }

          });

        } 

      }  
         
    });


});
 


router.delete('/delete', async (req, res) => {
    const userId = req.query.userId;
    const addId = req.query.addId;
    console.log(addId, userId);
    const getAddress = await Address.find().where('userId').in(req.query.userId).exec();

    if(getAddress) {
    await Address.updateOne( 
        {userId: userId}, 
        { $pull: {allAddresses:  {address: addId} }}
      ).exec((error, result) => {
          if(result) {
          res.status(200).json({successMessage: 'Address removed ', result});
          } 
          if(error) {
            res.status(404).json({ errorMessage:'No Address'});
          }
      });

   }  else {
       res.status(404).json({ errorMessage:'No Address'});
   }
    
    
});


module.exports = router;

