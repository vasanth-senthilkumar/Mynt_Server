const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/') 
    },

    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// const fileFilters = (req, file, cb) => {
//     if(file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/png') {
//         cb(null, true)
//     } else {
//         cb({errorMessage: 'Unsupported file format'}, false);
//     }
// }

const upload =  multer({
    storage : storage,
    // limits:  {fileSize: 2048 * 2048},
    // fileFilter: fileFilters
});

module.exports = upload;