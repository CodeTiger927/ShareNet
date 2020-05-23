var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection',(socket) => {
	console.log('a user connected');
	socket.on('disconnect',() => {
		console.log('user disconnected');
	});
});

app.use("/data", express.static(__dirname + '/data'));
app.use("/Photos", express.static(__dirname + '/UI/Photos'));
app.use("/css", express.static(__dirname + '/UI/css'));

app.get('/',(req,res) => {
	res.sendFile(__dirname + '/UI/index.html');
});

app.get('/register.html',(req,res) => {
	res.sendFile(__dirname + '/UI/register.html');
});

http.listen(3000,() => {
	console.log('listening on *:3000');
});