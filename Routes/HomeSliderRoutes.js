const express = require('express');
const Product = require('../Models/productModel');
const upload = require('./multer');
const cloudinary = require('./cloudinary');
const cloudinaryCon = require('./cloudinaryConfig');
const Slider = require('../Models/SliderModel');
var fs = require('fs');
const { AuthenticatorJWT, isAdmin } = require('./authenticator');

const router = express.Router();



router.get('/get', async(req, res) => {
     const getImages = await Slider.find();
     if(getImages) {
       res.status(200).json(getImages);
     } else {
       res.status(404).json({errorMessage: 'No sliders found.'});
     }
})

router.post('/slider/post', AuthenticatorJWT, isAdmin, upload.array('file'), async (req, res) => {
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
          HomeSlider = urls.map(pic => {
            return{
              img: pic.url,
              cloudinary_id: pic.id
            }
          })
        }   
       
    
          const slider = new Slider({HomeSlider});

          await slider.save(((error, result) => {
            if(error) 
            {
              res.status(400).json({errorMessage: 'Failed to save sliders. Please try again', error})
            }
         else if(result) {
            res.status(200).send({successMessage: 'Sliders Images saved successfully', result});
          } 
          else return null;
         
        }))

});


router.post('/slider/edit', AuthenticatorJWT, isAdmin, upload.single('file'), async (req, res) => {

    const del = await cloudinaryCon.uploader.destroy(req.body.cloudId);
        await Slider.updateOne( 
          {_id: req.body.sliderId}, 
          { $pull: {HomeSlider:  {_id: req.body.imgId} }} 
        ).then(result => {
            
        })

        const uploader = async(path) => await cloudinary.uploads(path, 'Images');

        const {path}   = req.file;
         newPath = await uploader(path);
        const HomeSlider = {img: newPath.url, cloudinary_id: newPath.id}
        fs.unlinkSync(path);
  
        await Slider.updateOne( 
          {_id: req.body.sliderId}, 
          { $push: {HomeSlider:  HomeSlider }} 
        ).then(result => {
            res.status(200).json({successMessage: 'Slider Updated Successfully.', result});
        })
    
});


router.post('/slider/add-image', AuthenticatorJWT, isAdmin, upload.single('file'), async (req, res) => {

  const uploader = async(path) => await cloudinary.uploads(path, 'Images');

   const {path}   = req.file;
   newPath = await uploader(path);
    const HomeSlider = {img: newPath.url, cloudinary_id: newPath.id}
     fs.unlinkSync(path);


  await Slider.updateOne( 
    {_id: req.body.sliderId}, 
    { $push: {HomeSlider:  HomeSlider }} 
  ).then(result => {
      res.status(200).json({successMessage: 'Image Aded Successfully.', result});
  })

});



router.post('/slider/delete', AuthenticatorJWT, isAdmin, async(req, res) => {
    const del =  await cloudinaryCon.uploader.destroy(req.body.cloudId);
          await Slider.updateOne( 
            {_id: req.body.sliderId}, 
            { $pull: {HomeSlider:  {_id: req.body.imgId} }} 
          ).then(result => {
              res.status(200).json({successMessage: 'Slider Deleted Successfully.', result});
          })
});





  module.exports = router;