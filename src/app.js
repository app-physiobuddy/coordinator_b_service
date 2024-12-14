
const express = require('express');

const router = require("./adapters/routes");
require('dotenv').config();
const erroHandler = require("./utils/errors/errorHandler")


const app = express();
app.use(express.json());

// Mount the routes
app.use('', router);

app.use(erroHandler);

const APP_PORT = process.env.APP_PORT;
app.listen(APP_PORT, () => {
    console.log(`JS Coordinator B service is running on http://localhost:${APP_PORT}`);
});