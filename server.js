const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
// refer to knex documentation for all DB related syntax.
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});

const app = express();
// Always remember to parse request to JSON
app.use(express.json());
app.use(cors());
// cors is needed to interact with local server otherwise chrome does not allow for security reasons

app.get('/', (req, res) => {
	console.log(database.users);
	res.send(database.users);
});

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handlApiCall(req, res)});

app.listen(3000, () => {
	console.log('app is running on port 3000')
});