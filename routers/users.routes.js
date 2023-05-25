const express = require('express')
const router = express.Router()
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersCollection = require('../models/users.model')

router.get(`/`, async (req, res) => {
    const user = await usersCollection.find().select('name phone email')
    if (!user) {
        res.status(500).json({ status: false, message: 'Users Not Found' })
    }
    res.send(user)
})

router.post(`/`, async (req, res) => {
    const enCryptedPsw = bycrypt.hashSync(req.body.passwordHash, 10)
    let user = new usersCollection({
        name: req.body.name,
        email: req.body.email,
        passwordHash: enCryptedPsw,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save()
    if (!user) {
        res.status(400).json({
            status: false,
            message: 'User cannot be Created',
        })
    }
    res.status(200).json({
        status: true,
        message: 'User Created',
    })
})

router.get('/:id', async (req, res) => {
    const user = await usersCollection
        .findById(req.params.id)
        .select('-passwordHash')
    if (!user) {
        res.status(500).json({
            success: false,
            message: 'User with given Id Not Found',
        })
    }
    if (user) {
        res.status(200).json(user)
    }
})

router.put('/:id', async (req, res) => {
    const userExists = await usersCollection.findById(req.params.id)
    if (!userExists) {
        res.status(400).json({
            status: false,
            message: 'Invalid User Id',
        })
        return
    }
    let newPassword
    if (req.body.passwordHash) {
        newPassword = bycrypt.hashSync(req.body.passwordHash, 10)
    } else {
        newPassword = userExists.passwordHash
    }

    usersCollection
        .findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash: newPassword,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country,
            },
            { new: true }
        )
        .then((user) => {
            if (user) {
                res.status(200).json(user)
            }
            if (!user) {
                res.status(400).json({
                    success: false,
                    message: 'User Details cannot be updated',
                })
            }
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                message: 'User Details cannot be updated',
            })
        })
})

router.post(`/login`, async (req, res) => {
    let user = await usersCollection.findOne({ email: req.body.email })
    if (!user) {
        res.status(400).json({
            success: false,
            message: 'User with given Email Not Found',
        })
    }

    if (user && bycrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                user: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        res.send({ user: user.email, token: token })
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid Credentials',
        })
    }
})
module.exports = router
