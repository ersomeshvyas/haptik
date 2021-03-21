/**
 * Author Somesh Vyas
 */
const express = require('express');
const app	= express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    auth = require('./middleware/authenticate'),
    user = require('./routes/user');

// Set bodyParser as middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/user',express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public/views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// Render Home Page
app.get('/', (req, res) => {
    res.render('index.html');
});

app.post('/login', user.login);
app.post('/addUser', user.verifyUser, user.verifyUserName, user.addUser);
app.post('/followUser', auth.authenticate, user.followUser);
app.post('/storeTweet', auth.authenticate, user.storeTweet);
app.post('/dashboard', auth.authenticate, user.dashboard);

// Start Server
app.listen(3000);