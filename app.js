require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const productsRouter = require('./routes/products');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDb = require('./db/connect')


const port = process.env.PORT || 3000;

app.use(express.json())


app.use('/products', productsRouter)

app.use(notFound);
app.use(errorHandlerMiddleware);


const start = async () => {
    //connect db
    try {
        await connectDb(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on port ${port}`));
    } catch (error) {
        console.log(error)   
    }
}

start();