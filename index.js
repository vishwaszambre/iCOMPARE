const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');
const port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Error in connection to database: ' + err);
    } else {
        //console.log(config.secret);
        console.log('Database connected successfully on port:27017 to ' + config.db);
    }
});

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
})

app.listen(port, () => {
    console.log('Listing on port :' + port);
});