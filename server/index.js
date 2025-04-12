require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);
const connecttoDB = require('./db/db');
const cookieparser = require('cookie-parser')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
connecttoDB();



const path = require('path');
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set(express.static(path.join(__dirname,"public")));

app.get('/', (req, res) => {
  res.redirect('/home');
});



app.use('/user',require('./routes/userRoutes'));
app.use('/github',require('./routes/githubRoutes'));
app.use('/home',require('./routes/homeRoutes'));
server.listen(3000);
