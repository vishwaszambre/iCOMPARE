const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');//Node tool for MongoDB
const config = require('./config/database');//Mongoose Config
const path = require('path');//Node JS Package for filr path
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');
const port = 3000;

//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Error in connection to database: ' + err);
    } else {
        //console.log(config.secret);
        console.log('Database connected successfully on port:27017 to ' + config.db);
    }
});

//app.use(express.static(__dirname + '/client/dist/'))
//Provide static directory for frontend
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/authentication', authentication);

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname + '/client/dist/index.html'));
    res.send('<h1>Hello world node is awesome!</h1>');
})

app.listen(port, () => {
    console.log('Listing on port :' + port);
});