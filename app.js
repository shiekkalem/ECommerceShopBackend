const express = require('express')
const app = express()
const morgan = require('morgan')
require('dotenv/config')
const ENV = process.env
const mongoose = require('mongoose')
const cors = require('cors')
const authJwt = require('./helpers/jwt')
app.use(express.json())
app.use(morgan('tiny'))

app.use(authJwt)
app.use(cors())
app.options('*', cors)

app.get('/', (req, res) => {
    res.send('Welcome to Ecommerce APP')
})

//routers
const productsRouter = require('./routers/products.routes')
app.use(`${ENV.API}/products`, productsRouter)

const categoriesRouter = require('./routers/categories.routes')
app.use(`${ENV.API}/categories`, categoriesRouter)

const ordersRouter = require('./routers/orders.route')
app.use(`${ENV.API}/orders`, ordersRouter)

const usersRouter = require('./routers/users.routes')
app.use(`${ENV.API}/users`, usersRouter)

mongoose
    .connect(ENV.MONGOOSE_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: ENV.DB_NAME,
    })
    .then(() => console.log('DB Connected Successfully'))
    .catch((err) => console.error('Some Error occurred in DB connection', err))
app.listen(ENV.PORT, () => {
    console.log('app is listening on the port ', ENV.PORT)
})
