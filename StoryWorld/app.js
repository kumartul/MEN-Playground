const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const connectDB = require('./db/connection');

connectDB();

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, 'localhost', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});