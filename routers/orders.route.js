const express = require('express')
const router = express.Router()

const ordersCollection = require('../models/orders.model')

router.post(`/`, (req, res) => {
    const order = new ordersCollection({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
    })
    order
        .save()
        .then((createdorder) => {
            res.status(200).json(order)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})
router.get(`/`, async (req, res) => {
    const orders = await ordersCollection.find()
    res.send(orders)
})

module.exports = router
