require('./db/connection');

const express = require('express');
const app = express();

const router = require('./routers/router');

app.use(express.json());

const port = process.env.PORT || 3000;

app.use(router);

app.listen(port, 'localhost', () => {
    console.log(`Server is running on port ${port}`);
});