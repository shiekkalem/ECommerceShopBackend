const express = require('express')
const router = express.Router()

const categoriesCollection = require('../models/categories.model')

router.post(`/`, (req, res) => {
    const category = new categoriesCollection({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })
    category
        .save()
        .then((createdcategory) => {
            res.status(200).json(createdcategory)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})

router.get(`/`, async (req, res) => {
    const categories = await categoriesCollection.find()
    if (!categories) {
        res.status(500).json({ success: false })
    }
    res.send(categories)
})

router.get('/:id', (req, res) => {
    categoriesCollection
        .findById(req.params.id)
        .then((category) => {
            if (category) {
                res.status(200).json(category)
            }
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Category with given Id Not Found',
                })
            }
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                message: 'Category Not Found',
            })
        })
})

router.put('/:id', (req, res) => {
    categoriesCollection
        .findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color,
            },
            { new: true }
        )
        .then((category) => {
            if (category) {
                res.status(200).json(category)
            }
            if (!category) {
                res.status(400).json({
                    success: false,
                    message: 'Category cannot be updated',
                })
            }
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                message: 'Category cannot be updated',
            })
        })
})

router.delete('/:id', (req, res) => {
    categoriesCollection
        .findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                res.status(200).json({
                    success: true,
                    message: 'Category Deleted',
                })
            }
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Category Not Found',
                })
            }
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                message: 'Category Not Deleted',
            })
        })
})

module.exports = router
