const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const client = require('./client');
//require the database model

const app = express();

app.use(function (req, res, next) {
    // allow for Cross Origin Resource Sharing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));

// app.post('/register', (req, res) => {
//     //registerId()
//     //res.status(200).send();
//     //else res.status(401).send('Invalid authentication credentials');
// });

app.post('/register', (req, res) => {

});





app.listen(3000, () => {
    console.log('Listening on port 3000!');
});