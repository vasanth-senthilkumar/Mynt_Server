const mongoonse = require('mongoose');

const wishlistSchema = new mongoonse.Schema({
    userId: {
        type: mongoonse.Schema.Types.ObjectId, 
        ref : 'User', 
        required: true
     },
     products: {
         type: Array,
         title: {
            type: String,
            required: true,
        },
        subTitle: {
            type: String, 
            required: true,
        },
        price: {
            type: Number, 
            required: true
        },
        offer: {
            type: Number, 
            required: true
        },
        priceAfterOff: {
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
       productColor: {
           type: String
       },
       image: {
            type: String,
            required: true
        },
        productSizes: [
            {
                size: {
                type: String,
                required: true
                }
        }
       ],
        category:  {type: String, required: true},
        brand:  {type: String, required: true},
        
     }

    


}

);

const wishlistModel = new mongoonse.model('wishlist', wishlistSchema);

module.exports = wishlistModel;