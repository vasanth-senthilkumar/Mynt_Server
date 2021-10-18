const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/keys');

AuthenticatorJWT = (req, res, next) => {
    const tokenWithBearer = req.headers.authorization;
    const token = tokenWithBearer.split(' ')[1];
    if(!token) {
         res.status(404).json({errorMessage: 'No token. Access Denied'});
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
           req.user = decoded.user;
           next();    
        
    } catch (error) {
        res.status(400).json({errorMessage: 'You cannot access this route due to invalid token.'});
        
    }

   
}

 isAdmin = (req, res, next) => {
    if(req.user && req.user.role === 1) {
        return next();
    } else {
        return res.status(401).send({ errorMessage: 'Admin not authorized.'});
    }
}


module.exports = {AuthenticatorJWT, isAdmin };