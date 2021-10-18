const express = require('express');
const Cart = require('../Models/cartModel');
const upload = require('./multer');
const Product = require('../Models/productModel');

const router = express.Router();

router.get('/get/:id', async (req, res) => {
    const getCart = await Cart.findOne({}).where('userId').in(req.params.id).exec();

    if(getCart) {
        res.status(200).json(getCart);
    } else {
        res.status(201).json({errorMessage: 'No cart found.'});
    }
})

router.get('/get-product', async(req, res) => {
    const userId = req.query.userId
    const productId = req.query.productId
    const getCart = await Cart.findOne({}).where('userId').in(userId).exec();
    if(getCart) {
        const findProduct = await getCart.products.filter(c => c.productId === productId);
        if(findProduct) {
          res.status(200).send(findProduct);
        }
    } else {
        res.status(404).json({errorMessage: 'No products found.'});
    }
 

   });

router.post('/post', upload.single(), async(req, res) => {
    const {title, subTitle, offer, offPrice, price, priceAfterOff, cat, brand, image, userId, productId, sizes, qty} = req.body;
    if(req.body.sizes && req.body.sizes.length > 0) {
        productSizes = req.body.sizes.map(savedSize => {
          return{
            size: savedSize
          }
          });
      }
      const result = await Cart.findOne({userId: userId});
        //   if(error) return res.status(400).json({error});

          if(result) {
            const item = result.products.find(c => c.productId === productId);
            if(item) {
                Cart.findOneAndUpdate({"userId": userId, "products.productId" : req.body.productId}, {
                    "$set": {
                        "products.$" : {
                            ...req.body,
                            sizeToShop: req.body.sizeToShop
                        }
                    }
                }).exec((error, newResult) => {
                    if(error) return res.status(400).json({error})
                    if(newResult) {
                     return res.status(200).json({newResult});
                    }

            });

          }  else {
           
            Cart.findOneAndUpdate({userId: userId}, {
                "$push": {
                    "products": req.body
                }
            }).exec((error, cart) => {
                if(error) return res.status(400).json({error});
                if(cart) {
                    return res.status(200).json({cart});
                }
            })
          }

        }  
           else {
            Cart.create({
                userId: userId,
                products: [{
                    userId,
                    productId,
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    price: req.body.price,
                    productSizes,
                    offer: req.body.offer,
                    offPrice: req.body.offPrice,
                    priceAfterOff: req.body.priceAfterOff,
                    coupan: req.body.coupan,
                    coupanDiscount: req.body.coupanDiscount,
                    productSize: req.body.sizeToShop,
                    category: req.body.cat,
                    brand: req.body.brand,
                    image: req.body.image,
                    coupanDiscountAmount: '',
                    coupanDiscount: '',
                    coupanStatus: 'false',
                    qty: 1
                }]
               
        });
        res.status(200).json({successMessage: 'Product added to Bag successfully.'});
           
        }
    //   });
    
});

router.post('/remove/:id', async (req, res) => {
    const userId = req.body.userId;
    const productId = req.params.id;
    const getCart = await Cart.find().where('userId').in(req.body.userId).exec();

    if(getCart) {
    Cart.updateOne( 
        {userId: userId}, 
        { $pull: {products:  {productId: productId} }}
      ).then(result => {
          res.status(200).json({successMessage: 'Product removed from bag.', result});
      })

   }  else {
       res.status(404).json({ errorMessage:'No products in bag'});
   }
    
})

router.post('/move/:id', async (req, res) => {
    const userId = req.body.userId;
    const productId = req.params.id;
    const getCart = await Cart.find().where('userId').in(req.body.userId).exec();

    if(getCart) {
    Cart.updateOne( 
        {userId: userId}, 
        { $pull: {products:  {productId: productId} }} 
      ).then(result => {
          res.status(200).json({successMessage: 'Product moved to Wishlist.', result});
      })

   }  else {
       res.status(404).json({ errorMessage:'No products in bag'});
   }
    
});


router.post('/postQty/:id', async (req, res) => {
    const qty = req.body.qtyToShop;
    const userId = req.body.userId;
    const productId = req.params.id;
    Cart.findOneAndUpdate({"userId": userId, "products.productId" : productId}, {
        "$set": {
            "products.$.qty" : 
            qty
        }
    })
     
    .exec((error, newResult) => {
        if(error) return res.status(400).json({error})
        if(newResult) {
         return res.status(200).json({newResult});
        }
   });
   
});

router.post('/postSize/:id', async (req, res) => {
   const sizeToShop = req.body.sizeToShop;
    const userId = req.body.userId;
    const productId = req.params.id;
    Cart.findOneAndUpdate({"userId": userId, "products.productId" : productId}, {
        "$set": {
            "products.$.sizeToShop" : 
                sizeToShop
        }
    })
     
    .exec((error, newResult) => {
        if(error) return res.status(400).json({error})
        if(newResult) {
         return res.status(200).json({newResult});
        }
   });
   
});

router.post('/coupan/apply', upload.single(''), async(req, res) => {
    const userId = req.body.userId;
    const prodId = req.body.prodId;
    const getCart = await Cart.findOne().where('userId').in(userId).exec();
    if(getCart) {
    await getCart.products.map(prod => {
        if(prod.coupan === req.body.coupanCode) {    
            if(prod.coupanStatus === 'false') {   
              if(prodId.length > 0) {
             prodId && prodId.map( async id => {
                 if(prod.productId === id) {
                const discount = prod.coupanDiscount;
                const priceAfterOff = prod.priceAfterOff;
                const coupanApplying = discount * priceAfterOff / 100;
                const finalPrice = priceAfterOff - coupanApplying;
               await Cart.findOneAndUpdate({"userId": userId, "products.productId" : id}, {
                    "$set": {
                        "products.$.coupanDiscountAmount": coupanApplying,
                        "products.$.coupanStatus": "true",
                        "products.$.priceAfterOff": finalPrice,
                    }
                });
            }
             });  
            }  else {
                const discount = prod.coupanDiscount;
                const priceAfterOff = prod.priceAfterOff;
                const coupanApplying = discount * priceAfterOff / 100;
                const finalPrice = priceAfterOff - coupanApplying;
                Cart.findOneAndUpdate({"userId": userId, "products.productId" : productId}, {
                    "$set": {
                        "products.$.coupanDiscountAmount": coupanApplying,
                        "products.$.coupanStatus": "true",
                        "products.$.priceAfterOff": finalPrice,
                    }
                });

            }
          

        }   else {
            res.status(201).json({errorMessage: 'Coupan is already applied.'})
        }
            

    }  else {
        res.status(201).json({errorMessage: 'Invalid Coupan'})
    }
    });
    res.status(200).json({success: 'done'})

} else {

}


})



module.exports = router;