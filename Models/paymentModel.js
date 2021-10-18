const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: Object,
        default: {}
    },
    userId: {
        type: String,
    },
    data: {
        type: Object,
        default: {}
    },
    product: {
        type: Array,
        default: []
    },
    totalPrice: {
        type: String,
        default: "0"
    },
    status: {
        type: String,
        default: "1"
    },
    placed: {
        type: String,
        default: ''
    },
    statusUpdateTime: {
        type: String,
        default: "---"
    }
  
}, {timestamps: true}
);

const paymentModel = new mongoose.model('Payment', paymentSchema);
module.exports = paymentModel;
