const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');


//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Import routes
const guildRoute = require('./routes/guild');
const playerRoute = require('./routes/player');
const prikazRoute = require('./routes/prikaz');

app.use('/guild', guildRoute)
app.use('/player', playerRoute)
app.use('/prikaz', prikazRoute)

var ura = new Date().toLocaleString();

// ROUTES
app.get('/info', (req,res) => {
    var cas = new Date().toLocaleString();
    res.send('<h1>Hypixel Slovenija API</h1><p>Author: <b>Marko</b></p><p>Time of build: <b>' + ura + '</b></p>');
})
app.use(express.static('website'));


//LISTEN TO SERVER
app.listen(8080, (() => console.log('Zagon ob ' + ura + '\nhttp://localhost:8080')));
