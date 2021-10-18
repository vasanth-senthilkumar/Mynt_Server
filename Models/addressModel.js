const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    allAddresses: {
        type: Array,
        pinCode: {
            type: Number,
            require: true
        },
        addId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        town: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        sunday: {
            type: String,
        },
        saturday: {
            type: String,
        },
        defaultAddress: {
            type: String,
        },
    }
   
  
}, {timestamps: true}
);

const addressModel = new mongoose.model('Address', addressSchema);
module.exports = addressModel;
