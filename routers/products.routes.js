const express = require('express')
const router = express.Router()

const productCollection = require('../models/products.model')
const categoriesCollection = require('../models/categories.model')
const mongoose = require('mongoose')
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('invalid image type')

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    },
})

const uploadOptions = multer({ storage: storage })

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    try {
        const category = await categoriesCollection.findById(req.body.category)
        if (!category) return res.status(400).send('Invalid Category')

        const file = req.file
        if (!file) return res.status(400).send('No image in the request')

        const fileName = file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        let product = new productCollection({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        })

        product = await product.save()

        if (!product)
            return res.status(500).send('The product cannot be created')

        res.send(product)
    } catch (error) {
        res.send(error)
    }
})

router.get(`/`, async (req, res) => {
    let filter = {}
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }
    const products = await productCollection.find(filter).populate('category')
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

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }
    const category = await categoriesCollection.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid Category')

    const product = await Product.findById(req.params.id)
    if (!product) return res.status(400).send('Invalid Product!')

    const file = req.file
    let imagepath

    if (file) {
        const fileName = file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        imagepath = `${basePath}${fileName}`
    } else {
        imagepath = product.image
    }

    const updatedProduct = await productCollection.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )

    if (!updatedProduct)
        return res.status(500).send('the product cannot be updated!')

    res.send(updatedProduct)
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

router.get('/get/count', async (req, res) => {
    const productsCount = await productCollection.countDocuments()
    if (productsCount) {
        res.status(200).json({ productsCount: productsCount })
    }
    if (!productsCount) {
        res.status(400).json({
            success: false,
            message: 'Product cannot be found',
        })
    }
})
router.get('/get/featured/:count', async (req, res) => {
    const limit = req.params.count || 0
    const product = await productCollection
        .find({ isFeatured: true })
        .limit(+limit)
    if (product) {
        res.status(200).json(product)
    }
    if (!product) {
        res.status(400).json({
            success: false,
            message: 'Featured Product Not Found',
        })
    }
})

router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
        }
        const files = req.files
        let imagesPaths = []
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`)
            })
        }

        const product = await productCollection.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        )

        if (!product)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(product)
    }
)
module.exports = router
