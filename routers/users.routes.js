const express = require('express')
const router = express.Router()

const usersCollection = require('../models/users.model')

router.post(`/`, (req, res) => {
    const user = new usersCollection({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
    })
    user
        .save()
        .then((createdUser) => {
            res.status(200).json(createdUser)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})
router.get(`/`, async (req, res) => {
    const users = await usersCollection.find()
    res.send(users)
})

module.exports = router
