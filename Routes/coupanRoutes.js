const express = require('express');
const upload = require('./multer');
const Coupan = require('../Models/coupanModel');
const Category = require('../Models/categoryModel');
const Product = require('../Models/productModel');
const { AuthenticatorJWT, isAdmin } = require('./authenticator');


const router = express.Router();

router.post('/post', AuthenticatorJWT, isAdmin, upload.single(''), async(req, res) => {
    console.log(req.body.coupan);
    const coupan = new Coupan({
        coupan: req.body.coupan,
        coupanDiscount: req.body.coupanDiscount
    });

    await coupan.save((error, result) => {
        if(error) {
            res.status(400).json({errorMessage: 'Unable to save coupan'});
        }  if(result) {
            res.status(200).json({successMessage: 'Coupan saved successfully.'})
        } 
    });
});


router.post('/update', AuthenticatorJWT, isAdmin, upload.single(''), async(req, res) => {
    const findCoupan = await Coupan.findOne({_id: req.body.coupanId});
    console.log(findCoupan)
    if(findCoupan) {
          findCoupan.coupan = req.body.coupan;
          findCoupan.coupanDiscount = req.body.coupanDiscount;
           await findCoupan.save((error, result) => {
            if(error) {
                res.status(400).json({errorMessage: 'Unable to save coupan'});
            }  if(result) {
                res.status(200).json({successMessage: 'Coupan saved successfully.'})
            } 
        });
    } else {
        res.status(404).json({errorMessage: 'No Coupan Found'});
    }
 
});

router.get('/get', async(req, res) => {
    const findCoupans = await Coupan.find().select('_id coupan coupanDiscount category').populate('category');
    if(findCoupans) {
        res.status(200).json(findCoupans);
    } else {
        res.status(404).json({errorMessage: 'Coupan not found.'});
    }
});

router.get('/get/:id', async(req, res) => {
    const findCoupan = await Coupan.findOne({_id: req.params.id});
    if(findCoupan) {
        res.status(200).json(findCoupan);
    } else {
        res.status(404).json({errorMessage: 'Coupan not found.'});
    }
});
+
router.post('/apply/:id', AuthenticatorJWT, isAdmin, upload.single(''), async(req, res) => {
       console.log(req.body.coupanCode, req.body.coupanDiscount, req.params.id);
       const findCoupan = await Coupan.findOne({_id: req.body.coupanId});
       if(findCoupan) {
           findCoupan.category = req.params.id
           await findCoupan.save();
       }
       const record = await Product.find().where('category').in(req.params.id).exec();
        record.map(async (allProd) => {
            allProd.coupan = req.body.coupanCode;
            allProd.coupanDiscount = req.body.coupanDiscount
            const saveCoupan = await allProd.save();
           if(saveCoupan){
            res.status(200).json({successMessage: 'Coupan added to All Products Successfully'});
          } 
            else {
              res.status(400).json({errorMessage: 'Coupan could not be added. Please Try Again'});
            } 
            
          });
    
  });
  
router.put('/delete/:id', AuthenticatorJWT, isAdmin, upload.single(''), async(req, res) => {

    if (req.body.catId === undefined || req.body.catId === null || !req.body.catId) {
        const findCoupan = await Coupan.findOne({_id: req.params.id});
        if (findCoupan) {
           const del = findCoupan.remove();
           if(del){
            res.status(200).json({successMessage: 'Coupan Deleted  Successfully'});
          } 
            else {
              res.status(400).json({errorMessage: 'Coupan could not be deleted. Please Try Again'});
            } 
            
    
        }  
    
       }

   else  {
    const record = await Product.find().where('category').in(req.body.catId).exec();
    console.log(record);
    record.map(async (allProd) => {
         allProd.coupan = '';
         allProd.coupanDiscount = ''
         await allProd.save();
       });
    
    const findCoupan = await Coupan.findOne({_id: req.params.id});
    if (findCoupan) {
       const del = findCoupan.remove();
       if(del){
        res.status(200).json({successMessage: 'Coupan Deleted from All Products Successfully'});
      } 
        else {
          res.status(400).json({errorMessage: 'Coupan could not be deleted. Please Try Again'});
        } 
        

    }  
} 
    
 
});


router.put('/edit/:id', AuthenticatorJWT, isAdmin, upload.single(''), async(req, res) => {
    console.log(req.body.coupan);
    const findCoupan = await Coupan.findOne({_id: req.params.id});
    if(findCoupan) {
        findCoupan.coupan= req.body.coupan,
        findCoupan.coupanDiscount= req.body.coupanDiscount
        findCoupan.save((error, result) => {
            if(error) {
                res.status(400).json({errorMessage: 'Unable to update coupan'});
            }  if(result) {
                res.status(200).json({successMessage: 'Coupan updated successfully.'})
            } 

        });
    }

      else {
        res.status(400).json({errorMessage: 'No coupan found'});
      }
});


module.exports = router;