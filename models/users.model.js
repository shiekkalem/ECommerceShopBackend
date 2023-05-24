const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true,
    },
})
const usersCollection = mongoose.model('user', usersSchema)
module.exports = usersCollection
