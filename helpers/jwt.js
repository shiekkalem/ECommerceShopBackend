const expressJwt = require('express-jwt')
const JWT_SECRET = process.env.JWT_SECRET

function authJwt() {
    return expressJwt({
        secret: JWT_SECRET,
        algorithms: ['HS256'],
    })
}
module.exports = authJwt()
