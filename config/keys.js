const dotenv = require('dotenv');
dotenv.config();

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod.js')
} 