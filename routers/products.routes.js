const express = require('express')
const router = express.Router()

const productCollection = require('../models/products.model')
const categoriesCollection = require('../models/categories.model')
const mongoose = require('mongoose')

router.post(`/`, async (req, res) => {
    try {
        const category = await categoriesCollection.findById(req.body.category)
        if (!category) {
            res.status(400).json({
                status: false,
                message: 'Invalid Category Id',
            })
            return
        }
        let product = new productCollection({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            image: req.body.image,
        })
        product = await product.save()
        if (!product) {
            res.status(400).json({
                status: false,
                message: 'product cannot be saved',
            })
        }
        res.status(200).json(product)
    } catch (error) {
        res.send(error)
        return
    }
})

router.get(`/`, async (req, res) => {
    const products = await productCollection.find().populate('category')
    res.send(products)
})

router.get('/:id', (req, res) => {
    productCollection
        .findById(req.params.id)
        .populate('category')
        .then((product) => {
            if (product) {
                res.status(200).json(product)
            }
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product with given Id Not Found',
                })
            }
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                message: 'Product Not Found',
            })
        })
})

router.put('/:id', async (req, res) => {
    try {
        if (req.body.category) {
            const isValidObjectId = mongoose.isValidObjectId(req.body.category)

            if (!isValidObjectId) {
                res.status(400).json({
                    status: false,
                    message: 'Invalid Category Id',
                })
                return
            }
            const category = await categoriesCollection.findById(
                req.body.category
            )
            if (!category) {
                res.status(400).json({
                    status: false,
                    message: 'Invalid Category Id',
                })
                return
            }
        }

        productCollection
            .findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    description: req.body.description,
                    richDescription: req.body.richDescription,
                    brand: req.body.brand,
                    price: req.body.price,
                    category: req.body.category,
                    countInStock: req.body.countInStock,
                    rating: req.body.rating,
                    numReviews: req.body.numReviews,
                    isFeatured: req.body.isFeatured,
                    image: req.body.image,
                },
                { new: true }
            )
            .then((product) => {
                if (product) {
                    res.status(200).json(product)
                }
                if (!product) {
                    res.status(400).json({
                        success: false,
                        message: 'Product cannot be updated',
                    })
                }
            })
            .catch((err) => {
                res.status(400).json({
                    success: false,
                    message: 'Product cannot be updated',
                })
            })
    } catch (error) {
        res.json(err)
        return
    }
})

router.delete('/:id', (req, res) => {
    productCollection
        .findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                res.status(200).json({
                    success: true,
                    message: 'Product Deleted',
                })
            }
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product Not Found',
                })
            }
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                message: 'Product Not Deleted',
            })
        })
})

router.get('/get/count', async(req, res) => {
    const productsCount = await productCollection.countDocuments()
    if (productsCount) {
        res.status(200).json({productsCount:productsCount})
    }
    if (!productsCount) {
        res.status(400).json({
            success: false,
            message: 'Product cannot be found',
        })
    }
})
router.get('/get/featured', async(req, res) => {
    const product = await productCollection.find()
    res.send({productsCount:productsCount})
    if (product) {
        res.status(200).json(product)
    }
    if (!product) {
        res.status(400).json({
            success: false,
            message: 'Product cannot be updated',
        })
    }
})
module.exports = router
