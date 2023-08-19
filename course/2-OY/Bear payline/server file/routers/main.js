const express = require('express');
const main = express.Router();

main.get('/', async(req, res) => {
    res.send('<h1>salom </h1>');
})


module.exports = main;