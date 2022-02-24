const express = require('express');

const User = require('../models/user');

const router = new express.Router();

router.get('/', (req, res) => {
    res.status(200);
    res.send('Home page');
});

router.get('/home', (req, res) => {
    res.status(200);
    res.send('Home page');
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();

        res.status(200);
        res.json(users);
    }
    catch(error) {
        res.status(502);
        res.json({
            message: 'error',
            error
        });
    }
});

router.get('/users/:email', async (req, res) => {
    try {
        const email = req.params.email;

        const user = await User.find({ email });

        res.status(200);
        res.json(user);
    }
    catch (error) {
        res.status(502);
        res.json({
            message: 'error',
            error
        });
    }
});

router.post('/users', async (req, res) => {
    try {
        const user = await new User(req.body);

        await user.save();

        res.status(200);
        res.json(user);
    }
    catch(error) {
        res.status(502);
        res.json({
            message: 'error',
            error
        });
    }
});

router.put('/users/:email', async (req, res) => {
    try {
        const email = req.params.email;

        const user = await User.findOneAndUpdate({ email }, req.body);
        
        res.status(200);
        res.json(user);
    }
    catch (error) {
        res.status(502);
        res.json({
            message: 'error',
            error
        });
    }
});

router.delete('/users/:email', async (req, res) => {
    try {
        const email = req.params.email;

        let user = await User.findOneAndDelete({ email });

        res.status(200);
        res.json(user);
    }
    catch (error) {
        res.status(502);
        res.json({
            message: 'error',
            error
        });
    }
});

module.exports = router;