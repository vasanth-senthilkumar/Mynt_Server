const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE,
    accountId: process.env.ACCOUNT_ID,
    authToken: process.env.AUTH_TOKEN,
    serviceSID: process.env.SERVICE_SID,
    api_key: process.env.API_KEY,
    DOMAIN: process.env.DOMAIN
}