const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
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

app.use(express.static(__dirname + '/client/dist/'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
})

app.listen(port, () => {
    console.log('Listing on port :' + port);
});