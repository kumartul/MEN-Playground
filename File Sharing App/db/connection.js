require('dotenv').config();

const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        await mongoose.connect(`mongodb://${process.env.MONGO_HOST_NAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`);
    
        console.log('Connection established successfully...');
    }
    catch(error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDatabase;