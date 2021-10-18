const express = require('express');
const Wish = require('../Models/wishlistModel');
const upload = require('./multer');

const router = express.Router();


router.get('/get/:id', async (req, res) => {
    const getWish = await Wish.findOne({}).where('userId').in(req.params.id).exec();
    if(getWish) {
        res.status(200).json(getWish);
    } else {
        res.status(201).json({errorMessage: 'No products in Wishlist.'})
    }
})

router.get('/:id', async(req, res) => {
    const findProduct = await Wish.findById({_id: req.params.id}).exec();
    if(findProduct) {
      res.status(200).send({findProduct});
    } else {
        res.status(201).json({errorMessage: 'No products in wishlist'});
    }

   });

router.post('/post', upload.single(), async(req, res) => {   
  
    console.log(req.body.sizes);
    const {title, subTitle, offer, offPricem, price, priceAfterOff, cat, brand, image, userId, productId, sizes} = req.body;
     
    if(req.body.sizes && req.body.sizes.length > 0) {
        productSizes = req.body.sizes.map(savedSize => {
          return{
            size: savedSize
          }
          });
      }
    const result = await Wish.findOne({userId: userId}).exec();
        // if(error) return res.status(400).json({error});
     if(result !== null) {
          const item = result.products.find(c => c.productId === productId);
          if(item) {
              Wish.findOneAndUpdate({"userId": userId, "products.productId" : req.body.productId}, {
                "$set": {
                    "products.$" : {
                        ...req.body,
                        sizeToShop: req.body.sizeToShop
                    }
                }
              }).exec((error, newResult) => {
                  if(error) return res.status(400).json({error})
                  if(newResult) {
                    return res.status(200).json({newResult})
                  }

          });

        }  else {
         
          Wish.findOneAndUpdate({userId: userId}, {
              "$push": {
                  "products": req.body
              }
          }).exec((error, wishlist) => {
              if(error) return res.status(400).json({error});
              if(wishlist) {
                  return res.status(200).json({wishlist});
              }
          })
        }

      }  
         else {
          Wish.create({
              userId: userId,
              products: [{
                  userId,
                  productId,
                  title: req.body.title,
                  subTitle: req.body.subTitle,
                  price: req.body.price,
                  offer: req.body.offer,
                  offPrice: req.body.offPrice,
                  priceAfterOff: req.body.priceAfterOff,
                  coupan: req.body.coupan,
                  productSizes,
                  coupanDiscount: req.body.coupanDiscount,
                  productSize: req.body.sizeToShop,
                  category: req.body.cat,
                  brand: req.body.brand,
                  image: req.body.image 
              }]
             
      });
      res.status(200).json({successMessage: 'Product added to Wishlist successfully.'});
      }
    // });
});

router.post('/remove/:id', async (req, res) => { 
    const userId = req.body.userId;
    const productId = req.params.id;
    const getWish = await Wish.find().where('userId').in(req.body.userId).exec();

    if(getWish) {
        Wish.updateOne( 
            {userId: userId}, 
            { $pull: {products:  {productId: productId} }} 
          ).then(result => {
              res.status(200).json({successMessage: 'Product removed from Wishlist.', result});
          })
    
       }  else {
           res.status(404).json({ errorMessage:'No products in Wishlist'});
       }
})

router.post('/move/:id', async (req, res) => {
    const userId = req.body.userId;
    const productId = req.params.id;
    const getWish = await Wish.find().where('userId').in(req.body.userId).exec();

    if(getWish) {
        Wish.updateOne( 
            {userId: userId}, 
            { $pull: {products:  {productId: productId} }} 
          ).then(result => {
              res.status(200).json({successMessage: 'Product moved to Bag.', result});
          })
    
       }  else {
           res.status(404).json({ errorMessage:'No products in Wishlist'});
       }
})



module.exports = router;