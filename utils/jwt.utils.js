const jwtUtils = require('../utils/jwt.utils');
const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = '0sjs6gjsk51o5RFsq456Tso51sf8q2KFVCp36Ld845DRT154';

// Exported Functions
module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id,
            username: userData.username,
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: 60*2
        }
        )
    },
    parseAuthorization: function (authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', ''): null;
    },
    getUserId: function (authorization) {
        var userId = -1;
        const token = module.exports.parseAuthorization(authorization);

        
        if (token != null) {
            try {
                const jwtToken = jwt.verify(token, JWT_SIGN_SECRET)
                
                if (jwtToken != null) {
                    userId = jwtToken.userId
                }

            }catch(err) {
                return err
            }
        }
        return userId; 
    },

   
}