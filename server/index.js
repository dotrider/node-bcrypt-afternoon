require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
// const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());

const {PORT_SERVER, CONNECTION_STRING, SESSION_SECRET} = process.env;
const authCtrl = require(`./controllers/authController`);
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');


massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('Connected to db')
})

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

//auth Endpoint
app.post(`/auth/register`, authCtrl.register);

app.post(`/auth/login`, authCtrl.login);

app.get(`/auth/logout`, authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);

app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);

app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);

app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

//Step 7
app.listen(PORT_SERVER, () => {
    console.log(`live from port ${PORT_SERVER}`)
})