const jwtUtils = require('../utils/jwt.utils');

exports.authenticated = (req, res, next) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const UserId = Number(jwtUtils.getUserId(headerAuth));
    
    if (UserId < 0) {
       return res.status(403).json({error: 'Wrong token', status: 403});
    }

    req.UserId = UserId

    next()
    
}