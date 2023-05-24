const mongoose = require('mongoose')

const ordersSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true,
    },
})
const ordersCollection = mongoose.model('order', ordersSchema)
module.exports = ordersCollection
