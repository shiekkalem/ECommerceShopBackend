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
    },
})
categoriesSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

categoriesSchema.set('toJSON', {
    virtuals: true,
})
const categoriesCollection = mongoose.model('Category', categoriesSchema)
module.exports = categoriesCollection
