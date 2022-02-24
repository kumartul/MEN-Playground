require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`)
.then(() => {
    console.log('Connection established successfully...');
})
.catch(error => {
    console.log(`Connection failed: ${error}`);
})