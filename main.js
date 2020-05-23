var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);



io.on('connection',(socket) => {
	console.log('a user connected');
	socket.on('disconnect',() => {
		console.log('user disconnected');
	});
});

app.get('/',(req,res) => {
	res.sendFile(__dirname + '/UI/index.html');
});


http.listen(3000,() => {
	console.log('listening on *:3000');
});