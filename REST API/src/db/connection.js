const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test')
.then(() => {
    console.log('Connection established successfully...');
})
.catch(error => {
    console.log(`Connection failed: ${error}`);
})