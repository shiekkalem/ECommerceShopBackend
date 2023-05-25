const expressJwt = require('express-jwt')
const JWT_SECRET = process.env.JWT_SECRET
const API_PATH = process.env.JWT_SECRET
function authJwt() {
    return expressJwt({
        secret: JWT_SECRET,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },

            `${API_PATH}users/register`,
            `${API_PATH}users/login`,
        ],
    })
}
async function isRevoked(req, payload, done) {
    // if (!payload.isAdmin) {
    //     done(null, true)
    // }
    done()
}
module.exports = authJwt()
