if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
//4000 port for socket
const io = require('socket.io')(4000);
const initializePassport = require('./passport-config');
const { cache } = require('ejs');
initializePassport(
	passport, 
	email => users.find(user => user.email === email),
	id => users.find(user => user.id === id)
);

const users = [];


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Paths

//Index
app.get ('/', checkNotAuthenticated, (req, res) => {
	res.render('index');
});
//Chat
app.get ('/chat', checkAuthenticated, (req, res) => {
	res.render('chat', { nick : req.nick });
});
//Real chat (iframe in chat)
app.get ('/real_chat', checkAuthenticated, (req, res) => {
	res.render('real_chat', { nick: req.user.nick });
});
//Login
app.get ('/login', checkNotAuthenticated, (req, res) => {
	res.render('login');
});
//Login post request
app.post ('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/chat',
	failureRedirect: '/login',
	failureFlash: true
}));
//Registration
app.get ('/registration', checkNotAuthenticated, (req, res) => {
	res.render('registration');
});
//Registration post request
app.post ('/registration', checkNotAuthenticated, async(req, res) => {
	try{
		//Hash password
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		//Making new user
		users.push({
			id: Date.now().toString(),
			nick: req.body.nick,
			email: req.body.email,
			password: hashedPassword
		});
		//Missing data
		res.redirect('/login');
	} catch{
		//User created
		res.redirect('/registration');
	}
	console.log(users);
});
//Lost password (for real not implemented)
app.get ('/lostpassword', checkNotAuthenticated, (req, res) => {
	res.render('lostpassword');
});
//Log out
app.get ('/logout', checkAuthenticated, (req, res) => {
	req.logout(function(err) {
		//Just because JS is gay
		if (err){
			return (err);
		}
		res.redirect('/');
	});
});
//Check if user is logged in
function checkAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}
//Check if user is not logged in
function checkNotAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return res.redirect('/chat');
	}
	next();
}

//404
app.all('*', (req, res) => {
	//Of course it's rick roll
	res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

//Port for web
app.listen(3000);


//Socket

//Socket database
const uporabniki = {};

io.on('connection', socket => {
	//Connect
	socket.on('new-user', name => {
		uporabniki[socket.id] = 'Sogovornik';
		socket.broadcast.emit('user-connected', name);
		console.log(uporabniki);
	});
	//Send new messege
	socket.on('send-chat-message', message => {
		socket.broadcast.emit('chat-message', { message: message, name: uporabniki[socket.id] });
	});
	//Disconnect
	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', uporabniki[socket.id]);
		delete uporabniki[socket.id];
	});
});