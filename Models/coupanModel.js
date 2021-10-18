const mongoose = require('mongoose');

const coupanSchema = new mongoose.Schema({
    coupan: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'Category', 
    },
    coupanDiscount: {
        type: String,
        required: true
    }
  
});

const coupanModel = new mongoose.model('Coupan', coupanSchema);

module.exports = coupanModel;