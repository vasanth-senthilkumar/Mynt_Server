const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    img: {
        type: String,
    },
    cloudinary_id: {
        type : String
    },

   
}, {timestamps: true}
);

const brandModel = mongoose.model('Brand', brandSchema);
module.exports = brandModel;