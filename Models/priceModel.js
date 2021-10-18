const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    priceRange: {
        type: String,
        required: true
    },
  
});

const priceModel = new mongoose.model('Price', priceSchema);

module.exports = priceModel;