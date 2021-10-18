const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    mainCatName: {
        type: String
         
     },
    parentId: {
        type: String
    }, 
          img: {
                type: String,
            },
            cloudinary_id: {
                type : String
            },
      
   
}, {timestamps: true}
);

const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;