const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: '',
    },
    image: [{ type: String }],
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1000,
    },
    rating: {
        type: String,
        default: 0,
    },
    numReviews: {
        type: String,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})
productsSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
productsSchema.set('toJSON', {
    virtuals: true,
})
const productCollection = mongoose.model('product', productsSchema)
module.exports = productCollection
