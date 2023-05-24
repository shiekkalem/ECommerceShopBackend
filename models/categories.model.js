const mongoose = require('mongoose')

const categoriesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    }
})
const categoriesCollection = mongoose.model('category', categoriesSchema)
module.exports = categoriesCollection
