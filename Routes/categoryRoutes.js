const express = require('express');
const Category = require('../Models/categoryModel');
const Brand = require('../Models/brandCategoryModel');
const Price = require('../Models/priceModel');
const upload = require('./multer');
const cloudinary = require('./cloudinary');
const cloudinaryCon = require('./cloudinaryConfig');
const { AuthenticatorJWT, isAdmin } = require('./authenticator');



const router = express.Router();

function getAllCategories (categories, parentId = null) {
    const categoryList = [];
    let category;
    if(parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined);
    } else {
        category = categories.filter(cat => cat.parentId == parentId);
    }

    for(let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            category: cate.mainCatName,
            img: cate.img,
            img: cate.img,
            cloudinary_id: cate.cloudinary_id,
            children: getAllCategories(categories, cate._id)
        })
    }
    return categoryList;
}

router.get('/', async (req, res) => {
    Category.find({})
    .exec((error, categories) => {
        if(error) {
            res.status(404).json({errorMessage: 'Error in finding categories'});
        }
        if(categories) {
            const categoryList = getAllCategories(categories);
            res.status(200).send(categoryList);
        }
    });
});

router.post('/main-category/create', AuthenticatorJWT, isAdmin, async(req, res) => {
    const category = new Category({
        name: req.body.name,
    });

    if(req.body.parentId) {
        category.parentId === req.body.parentId
    }
    const ifAlreadyExists = await Category.findOne({name: req.body.name});
    if(ifAlreadyExists) {
        res.status(201).json({errorMessage: `Category ${req.body.name} already exists`})
    } else {
    const newCategory = category.save();
    if(newCategory) {
        res.status(200).json(`Category ${req.body.name} created successfully`);
    } else {
        res.status(400).json('Category is not created. Please Try Again')
    }
  }
});


router.post('/sub-category/create', AuthenticatorJWT, isAdmin, upload.single('file'), async(req, res) => {
        const uploader = async(path) => await cloudinary.uploads(path, 'Images');

        const {path}   = req.file;
        const newPath = await uploader(path);

        const category = new Category({
            name: req.body.name,
            parentId: req.body.parentId,
            img: newPath.url,
            cloudinary_id: newPath.id
        });
    
        if(req.body.parentId) {
            category.parentId === req.body.parentId
        }

    const newCategory = category.save();
    if(newCategory) {
        res.status(200).json(`Category ${req.body.name} created successfully`);
    } else {
        res.status(400).json('Category is not created. Please Try Again')
    }
  
});

router.post('/child-sub-category/create', AuthenticatorJWT, isAdmin, upload.single('file') ,async(req, res) => {
        const uploader = async(path) => await cloudinary.uploads(path, 'Images');

        const {path}   = req.file;
        const newPath = await uploader(path);

        const saveSubCat = new Category({
            name: req.body.name,
            parentId: req.body.parentId,
            img: newPath.url,
            cloudinary_id: newPath.id
        });
        
    if(req.body.parentId) {
        saveSubCat.parentId === req.body.parentId
    }

    const savedSubCat =  await saveSubCat.save();

    if(savedSubCat) {
            res.status(200).json({successMessage: `Sub-Category ${req.body.name} is created successfully!`});
        } else {
            res.status(400).json({errorMessage: `Unable to create Sub-Category ${req.body.name}. Please Try Again in a while`})
        }

});

router.get('/edit/:id', async(req, res) => {
    const editCategory = await Category.findById({_id: req.params.id});
    if(!editCategory.parentId){
        res.status(200).json({category: editCategory});
    }  
     else if(editCategory || editCategory.parentId) {
        const parentCat = await Category.findById({_id: editCategory.parentId})
        res.status(200).json({category: editCategory, parentCat: parentCat});
    } else {
        res.status(400).json({errorMessage: 'Category not found. Please try again'});
    }

    
    

});

router.put('/update/:id', AuthenticatorJWT, isAdmin, upload.single('file'), async(req, res) => {
    const editCategory = await Category.findById({_id : req.params.id});
    if(req.file) {
        const imgUrl = editCategory.cloudinary_id;
        const del =  cloudinaryCon.uploader.destroy(imgUrl);
    }
    if(editCategory) {
        if(req.file) { 
    
        const uploader = async(path) => await cloudinary.uploads(path, 'Images');

        const {path}   = req.file;
         newPath = await uploader(path);
         editCategory.name = req.body.cat;
         editCategory.img = newPath.url;
         editCategory.cloudinary_id = newPath.id;
        }
    
        else if(req.body.image) {
            editCategory.name = req.body.cat;
            editCategory.img = req.body.image;
           
        }

        const editedCategory = editCategory.save();
        if(editedCategory) {
            res.status(200).json({successMessage: `Category updated successfully!`})
        }
  
     } else {
        res.status(400).json({errorMessage: 'Unable to update Category. Please try again!'});
    }

});

router.delete('/delete/:id', AuthenticatorJWT, isAdmin, async(req, res) => {
    const deleteCategory = await Category.findById({_id: req.params.id})
    if(deleteCategory) {
        const imgUrl = deleteCategory.cloudinary_id;
        const del =  cloudinaryCon.uploader.destroy(imgUrl);
         deleteCategory.remove();
        res.status(200).json({successMessage: `Category ${deleteCategory.name} has been deleted successfully`});
    } else {
        res.status(400).json({errorMessage: 'Category could not be deleted. Please try again'});
    }

});




/***********************************************************Brands *******************************************/

router.get('/brands', async(req, res) => {
    await Brand.find().sort('1').exec((error, brands) => {
        if(error) {
            res.status(404).json({errorMessage: 'No Brands Found'});
        }
        if(brands) {
            res.status(200).json({brands});
        }
    })
});

router.get('/brands/:id', async(req, res) => {

    await await Brand.findById({_id: req.params.id}).exec((error, brand) => {
        if(error) {
            res.status(404).json({errorMessage: `Brand ${req.params.id} not found`});
        }
        if(brand) {
            res.status(200).json({brand});
        }
    })
});



router.post('/brands/create', AuthenticatorJWT, isAdmin, upload.single('file'), async (req, res) => {
   

    const ifAlreadyExists =  await Brand.findOne({name: req.body.name});
    if(ifAlreadyExists) {
        res.status(201).json({errorMessage: `Brand ${req.body.name} already exists`});
    } else {

        const uploader = async(path) => await cloudinary.uploads(path, 'Images');

        const {path}   = req.file;
        const newPath = await uploader(path);

        const brands = new Brand({
            name: req.body.name,
            img: newPath.url,
            cloudinary_id: newPath.id

        });

        await brands.save((error, brand) => {
            if(error) {
                res.status(400).json({errorMessage: 'Failed to create brand. Please try again'});
            }
            if(brand) {
                res.status(200).json({successMessage: `Brand ${brand.name} created successfully`});
            }
          
        })

    }

 
})

router.put('/brands/update/:id', AuthenticatorJWT, isAdmin, upload.single('file'), async(req, res) => {
   const brand =  await Brand.findById({_id: req.params.id});
   if(req.file) {
    const imgUrl = brand.cloudinary_id;
    const del =  cloudinaryCon.uploader.destroy(imgUrl);
}
   if(brand) {
       if(req.file) {
        const uploader = async(path) => await cloudinary.uploads(path, 'Images');

        const {path}   = req.file;
         newPath = await uploader(path);
         brand.name = req.body.name;
         brand.img = newPath.url;
         brand.cloudinary_id = newPath.id

       } else {
        brand.name = req.body.name;
        brand.img = req.body.image;

       }

       brand.save((error, savedBrand) => {
          if(error) {
            res.status(400).json({errorMessage: 'Failed to update brand name'});

          }
          if(savedBrand) {
            res.status(200).json({successMessage: `Brand name changed to ${req.body.name} successfully`});

          }
      });
     
   }   
   else {
    res.status(404).json({errorMessage: 'Brand not found'});
}
});

router.delete('/brands/delete/:id', AuthenticatorJWT, isAdmin, async(req, res) => {
    await Brand.findById({_id: req.params.id}).exec((error, brand) => {
        if(brand) {
            const imgUrl = brand.cloudinary_id;
            const del =  cloudinaryCon.uploader.destroy(imgUrl);
            brand.remove();
            res.status(200).json({successMessage: `Brand ${brand.name} deleted successfully`});
        } 
        if(error) {
            res.status(400).json({errorMessage: `Unable to delete brand. Please try again`});
        }
    })
    

});


/********************************************Price Ranges  ****************************************/
 
  router.get('/price-ranges', async(req, res) => {
      await Price.find().exec((error, range) => {
          if(error) {
              res.status(404).json({errorMessage: 'No Price Found'});
          }
          if(range) {
              res.status(200).json({range});
          }
      })
  })


 router.post('/price-range/create', AuthenticatorJWT, isAdmin, async(req, res) => {
     const priceRange = req.body.priceRange;
     const ifAlreadyExists = await Price.findOne({priceRange});
     if(ifAlreadyExists) {
        res.status(201).json({errorMessage: `Price Range ${priceRange} already exists`});
     } else {
     const prices = new Price({
         priceRange: priceRange,
     });

    await prices.save((error, range) => {
        if(error) {
            res.status(400).json({errorMessage: 'Failed to create Price Range. Please try again'});
        }
        if(range) {
            res.status(200).json({successMessage: `Price Range ${range.priceRange} created successfully`});
        }

    });
 }
     
 });


 router.get('/price-range/:id', async(req, res) => {
     const findPrice = await Price.findById({_id: req.params.id});
     if(findPrice) {
         res.status(200).json({findPrice});
     } else {
         res.status(404).json({errorMessage: 'No Price Range'});
     }
 })

 router.put('/price-range/update/:id', AuthenticatorJWT, isAdmin, async(req, res) => {
    const findPrice =  await Price.findById({_id: req.params.id});
        
        if(findPrice) {
            findPrice.priceRange = req.body.priceRange
        }
        await findPrice.save((error, savedPrice) => {
            if(error) {
              res.status(400).json({errorMessage: 'Failed to update Price Range'});
  
            }
            if(savedPrice) {
              res.status(200).json({successMessage: `Price Range changed to ${savedPrice.priceRange} successfully`});
  
            }
        });
     
 });

 router.delete('/price-range/delete/:id', AuthenticatorJWT, isAdmin, async(req, res) => {
    await Price.findById({_id: req.params.id}).exec((error, range) => {
        if(range) {
            range.remove();
            res.status(200).json({successMessage: `Price Range ${range.priceRange} deleted successfully`});
        } 
        if(error) {
            res.status(400).json({errorMessage: `Unable to delete Price Range. Please try again`});
        }
    })
    

});


module.exports = router;