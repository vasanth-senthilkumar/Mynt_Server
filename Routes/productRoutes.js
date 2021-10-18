const express = require('express');
const Product = require('../Models/productModel');
const User = require('../Models/userModel');
const upload = require('./multer');
const cloudinary = require('./cloudinary');
const cloudinaryCon = require('./cloudinaryConfig');
var fs = require('fs');
const Category = require('../Models/categoryModel');
const {AuthenticatorJWT}  = require('./authenticator');
const {isAdmin}  = require('./authenticator');


const router = express.Router();



router.get('/get', async (req, res) => {
  const products =  await Product.find({}).select('_id isHover coupan coupanDiscount coupanDiscountAmount priceAfterOff offPrice title subTitle priceRange brand description productSizes productPictures price category')
                                          .populate('category brand priceRange').exec();

   res.status(200).send({products});
});

router.get('/:id', async(req, res) => {
     const findProduct = await Product.findOne({_id: req.params.id}).select('_id isHover coupan coupanDiscountAmount coupanDiscount priceAfterOff offPrice title priceRange productColors offer subTitle brand description productSizes productPictures price category')
                                                                      .populate('category brand priceRange').exec();
     if(findProduct) {
       res.status(200).send({findProduct});
     }

    });

  router.get('/product/:id', async(req, res) => {
      
      const findProduct = await Product.findOne({_id: req.params.id}).select('_id isHover coupan comments coupanDiscountAmount coupanDiscount priceAfterOff offPrice title productColors offer subTitle brand description productSizes productPictures price category')
                                                                      .populate('category brand').exec();
      if(findProduct) {
        res.status(200).send(findProduct);
      }
 
     });  

 router.get('/get/:id', async(req, res) => {
   const findCat = await Category.findOne({_id: req.params.id});
   const findProducts = await Product.find({category: findCat._id}).select('_id isHover coupan comments coupanDiscountAmount coupanDiscount priceAfterOff offPrice title productColors offer subTitle brand description productSizes productPictures price category')
                                                                    .populate('category brand').exec();
   if(findProducts) {
     res.status(200).json({findProducts});
   }  
 })   

 router.get('/productsByBrand/get/:id', async(req, res) => {
  const findProducts = await Product.find({brand: req.params.id}).select('_id isHover coupanDiscountAmount priceAfterOff offPrice title productColors priceRange offer subTitle brand description productSizes productPictures price category')
                                                                   .populate('category brand priceRange').exec();
  if(findProducts) {
    res.status(200).json({findProducts});
  }  
})   

router.get('/productsByPriceRange/get/:id', async(req, res) => {
  const findProducts = await Product.find({priceRange: req.params.id}).select('_id isHover coupanDiscountAmount priceAfterOff offPrice title productColors priceRange offer subTitle brand description productSizes productPictures price category')
                                                                   .populate('category brand priceRange').exec();
  if(findProducts) {
    res.status(200).json({findProducts});
  }  
})   

 router.post('/create', AuthenticatorJWT, isAdmin, upload.array('file'), async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Images')
  const urls = [];
        const files = req.files;
        for (const file of files) {
          const {path}   = file;
          const newPath = await uploader(path)
          urls.push(newPath);

          fs.unlinkSync(path);
        
        }
       
        if(urls && urls.length > 0) {
          productPictures = urls.map(pic => {
            return{
              img: pic.url,
              cloudinary_id: pic.id
            }
          })
        }   
       
        if(req.body.sizes && req.body.sizes.length > 0) {
          productSizes = req.body.sizes.map(savedSize => {
            return{
              size: savedSize
            }
            });
        }
        if(req.body.colors && req.body.colors.length > 0) {
          productColors = req.body.colors.map(saveColor => {
            return{
              color: saveColor
            }
            });
        }

        const productPrice = req.body.offer * req.body.price /100;
        const priceAfterOff = req.body.price - productPrice;

          const product = new Product({
            title: req.body.title,
            subTitle: req.body.subTitle,
            description: req.body.description,
            price: req.body.price,
            priceAfterOff: priceAfterOff,
            offer: req.body.offer,
            offPrice: productPrice,
            productSizes,
            productColors,
            category: req.body.cat,
            brand: req.body.brandId,
            priceRange: req.body.priceId,
            productPictures
            
          });

          const newProd =  await product.save(((error, result) => {
            if(error) 
            {
              res.status(400).json({errorMessage: 'Failed to create product. Please try again', error})
            }
         else if(result) {
            res.status(200).send({successMessage: 'Porduct created successfully', result});
          } 
          else return null;
         
        }))

});



router.put('/update/:id', AuthenticatorJWT, isAdmin, upload.array('file'),async(req, res) => {
  const findProduct = await Product.findById({_id: req.params.id});
     if(findProduct) {
 
      if(req.body.images && req.body.images.length > 0 && req.files && req.files.length > 0) {
        const uploader = async (path) => await cloudinary.uploads(path, 'Images')
        const urls = [];
          const files = req.files;
          for (const file of files) {
            const {path}   = file;
            const newPath = await uploader(path)
            urls.push(newPath);
  
            fs.unlinkSync(path);
          
          }
         
          if(urls && urls.length > 0) {
            productPictures = urls.map(pic => {
              return {
                img: pic.url
              }
            })
          }   
          
    } 
       else if(req.files && !req.body.images) {
          const uploader = async (path) => await cloudinary.uploads(path, 'Images')
          const urls = [];
            const files = req.files;
            for (const file of files) {
              const {path}   = file;
              const newPath = await uploader(path)
              urls.push(newPath);

              fs.unlinkSync(path);
            
            }
       
        if(urls && urls.length > 0) {
          productPictures = urls.map(pic => {
            return{
              img: pic.url
            }
          })
        }   
        console.log('Only files');

      }   
      else if(req.body.images) {
        productPictures = req.body.images && req.body.images.map(pic => {
          return{
            img: pic
          }
        });
        console.log('Only Images');

      }
       
        if(req.body.sizes && req.body.sizes.length > 0) {
          productSizes = req.body.sizes.map(savedSize => {
            return{
              size: savedSize
            }
            });
        }
        if(req.body.colors && req.body.colors.length > 0) {
          productColors = req.body.colors.map(saveColor => {
            return{
              color: saveColor
            }
            });
        }

           const productPrice = req.body.offer * req.body.price / 100;
           const priceAfterOff = req.body.price - productPrice;

            findProduct.title = req.body.title,
            findProduct.subTitle = req.body.subTitle,
            findProduct.description = req.body.description,
            findProduct.price = req.body.price,
            findProduct.priceAfterOff = priceAfterOff,
            findProduct.offer = req.body.offer,
            findProduct.offPrice = productPrice,
            findProduct.productSizes = productSizes,
            findProduct.productColors = productColors
            findProduct.category = req.body.category,
            findProduct.brand = req.body.brandId,
            findProduct.productPictures = productPictures,
            findProduct.priceRange = req.body.priceId,
            findProduct.productPictures = productPictures
            
         

          const editProd =  await findProduct.save(((error, result) => {
            if(error) 
            {
              res.status(400).json({errorMessage: 'Failed to update product. Please try again', error})
            }
         else if(result) {
            res.status(200).send({successMessage: 'Porduct Updated successfully', result});
          } 
          else return null;
         
        }))

      }

    

      else {
        res.status(404).json({errorMessage: 'Product not found'});
      }
    
    });


router.delete('/delete/:id', AuthenticatorJWT, isAdmin, async(req, res) => {
    let product =  await Product.findById({_id: req.params.id});
       if(product) {
         product.productPictures.map(pic => {
          const imgUrl = pic.cloudinary_id;
          const del =  cloudinaryCon.uploader.destroy(imgUrl);
         });
        product.remove(); 
        res.status(200).json({successMessage: 'Product Deleted Successfully'});


       }
});


router.post('/search', async(req, res) => {
    const searchText = new RegExp(req.body.query, 'i');
    Product.find({title: searchText})
    .select("_id title")
    .then(product => {
      res.status(200).json(product);
    }).catch(err => {
      console.log(err);
      res.status(400).json({errorMessage: 'No Search Results'});
    })

})


router.get('/get/related/:id', async (req, res) => {
     const products =  await Product.find().where('category').in(req.params.id).exec();
   res.status(200).send({products});
});


module.exports = router;



