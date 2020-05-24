var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var md5 = require("blueimp-md5");

const data = require("./data/log.json");
var fs = require('fs');

const request = require('request');


io.on('connection',(socket) => {
	console.log('a user connected');
	socket.on('disconnect',() => {
		console.log('user disconnected');
	});

	socket.on('register',(usr,pwd,addr,type) => {
		register(usr,pwd,type,addr);
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

app.get('/allReq',(req,res) => {
	res.sendFile(__dirname + '/UI/HelperView/allRequestsAndMyRequests.html');
});

app.get('/makeReq',(req,res) => {
	res.sendFile(__dirname + '/UI/RequesterView/makeRequests.html');
});

http.listen(3000,() => {
	console.log('listening on *:3000');
});






// File system
function createFile(location,name) {
	console(location + "/" + name);
	fs.writeFile(location + '/' + name,'',function(err) {
		if(err) {
			throw err;
		}
		console.log("File is created successfully");
	});
}

function CreateFile(name){
	createFile("./data/userData", name + ".json");
}

function createJSON(name) {
	console.log("Okay");
	createFile(name);
	writeFile("./data/userData",name + ".json","{}");
}


function deleteFile(location,name) {
	fs.unlink(location + '/' + name,'',function(err) {
		if(err) {
			throw err;
		}
		console.log("File is deleted successfully");
	});
}

function writeFile(location,name,value) {
	fs.writeFile(location + '/' + name,value,function writeJSON(err) {
		if(err) {
			return console.log(err);
		}
	});
}

function writeJSON(location,name,jsonOBJ) {
	writeFile(location,name,JSON.stringify(jsonOBJ));
}

//========================================================



function getJSONValue(user){
	var userData = require('./data/userData/' + user + '.json');
	return userData;
}

function getJSONValue(user, key){
	var userData = require('./data/userData/' + user + '.json');
	return userData[key];
}

function changeJSONValue(user, key, value){
	var user = getJSONValue(user);
	user[key] = value;
	writeJSON("./data/userData",username + ".json",user);
}

// 0 - Requester
// 1 - Helper 

function register(username,password,type,location){
	if(!fs.existsSync("./data/userData/" + username + ".json")) {
		fs.writeFile("./data/userData/" + username + ".json","{}",function() {
			request({url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyADkEWk0rw92U2RLe3_8z0ejK1MQ-mUs9w&language=en&address=" + location},
			(error,res,body) => {
				if(error) {
					return;
				}else{
					var jsonObj = JSON.parse(body);
					postGetLL(username,password,type,jsonObj.results[0].geometry.location.lat,type,jsonObj.results[0].geometry.location.lng);
				}
			});
		});
	}
	
}

function postGetLL(username,password,type,latitude,longtitude) {
	var user = require("./data/userData/" + username + ".json");
	user["password"] = md5(password);
	user["type"] = type;
	user["long"] = longtitude;
	user["lat"] = latitude;
	user["log"] = {};
	writeFile("./data/userData",username + ".json",JSON.stringify(user));
}

//description, sender, accepter
function addRequest(requester, description){
	data[ID] = {"requester":requester, "description":description,
				"lat":getJSONValue(requester, "lat"), 
				"long":getJSONValue(requester, "long")};
}


function acceptRequest(accepter, ID){
	var request = requestLogData[ID];
	requester = request['requester'];
	requestLogData.delete(ID);
	var logUpdate = getJSONValue(accepter, 'log');
	logUpdate.push(request);
	changeJSONValue(accepter, 'log', logUpdate);
	changeJSONValue(requester, 'log', logUpdate);
}

function endRequest(accepter, ID){
	var currLog = getJSONValue(accepter, 'log')
	currLog.delete(ID);
	changeJSONValue(accepter, 'log', currLog);
}