const mongoonse = require('mongoose');

const productShema = new mongoonse.Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    priceAfterOff: {
        type: Number, 
        required: true
    },
    offer: {
        type: Number, 
        required: true
    },
    offPrice: {
        type: Number, 
        required: true
    },
    coupan : {
        type: String, 
        default: ''
    },
    coupanDiscount : {
        type: String, 
        default: ''
    },
    qty: {
        type: Number,
        default: 0
    },
    productSizes: [
        {
            size: {
            type: String, 
            required: true
            }
    }
   ],
   productColors: [
    {
        color: {
        type: String, 
        required: true
        }
        }
        ],
    productPictures: [
        {
            img: {
                type: String,
            },
            cloudinary_id: {
                type : String
            }
        }
    ],
    category:  {type: mongoonse.Schema.Types.ObjectId, ref : 'Category', required: true},
    brand:  {type: mongoonse.Schema.Types.ObjectId, ref : 'Brand', required: true},
    priceRange:  {type: mongoonse.Schema.Types.ObjectId, ref : 'Price', required: true},
    


}

);

const productModel = new mongoonse.model('Product', productShema);

module.exports = productModel;