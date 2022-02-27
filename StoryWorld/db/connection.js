const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`mongodb://localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`);

        console.log('Connection established successfully...');
    }
    catch(error) {
        console.error(`Connection failed: ${error}`);
        process.exit(1);
    }
}

module.exports = connectDB;