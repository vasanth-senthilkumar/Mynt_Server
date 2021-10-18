const mongoonse = require('mongoose');

const sliderSchema = new mongoonse.Schema({
    HomeSlider: [
        {
            img: {
                type: String,
            },
            cloudinary_id: {
                type : String
            }
        }
    ],
   
}, {timestamps: true}

);

const sliderModel = new mongoonse.model('Slider', sliderSchema);

module.exports = sliderModel;