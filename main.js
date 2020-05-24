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

app.get('/viewReqs',(req,res) => {
	res.sendFile(__dirname + '/UI/HelperView/acceptedRequests.html');
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



function getJSONValue(user, key){
	var userData = require('./data/userData/' + user + '.json');
	return userData[key];
}

function changeJSONValue(user, key, value){
	var userData = require('./data/userData/' + user + '.json');
	userData[key] = value;
	writeJSON("./data/userData",user + ".json",userData);
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
					postGetLL(username,password,type,jsonObj.results[0].geometry.location);
				}
			});
		});
	}
	
}

function postGetLL(username,password,type,location) {
	var user = require("./data/userData/" + username + ".json");
	user["password"] = md5(password);
	user["type"] = type;
	user["long"] = location.lng;
	user["lat"] = location.lat;
	user["log"] = {};
	writeFile("./data/userData",username + ".json",JSON.stringify(user));
}

//description, sender, accepter
function addRequest(requester,description){
	data["counter"]++;
	data[data["counter"]] = {"requester":requester, "description":description,
				"lat":getJSONValue(requester,"lat"), 
				"long":getJSONValue(requester,"long"),
				"contact":getJSONValue(requester,"contact")};
	writeFile("./data","log.json",JSON.stringify(data));
}


function acceptRequest(accepter,ID){
	var request = data[ID];
	var requester = request['requester'];

	var logUpdateReq = getJSONValue(requester,'log');
	logUpdateReq[ID] = request;

	var logUpdateAcc = getJSONValue(accepter,'log');
	logUpdateAcc[ID] = request;

	//changeJSONValue(accepter,'log',logUpdate);
	changeJSONValue(requester,'log',logUpdateReq);
	changeJSONValue(accepter,'log',logUpdateAcc);

	delete data[ID];
	writeFile("./data","log.json",JSON.stringify(data));

}

function endRequest(accepter, ID){
	var currLogAcc = getJSONValue(accepter,'log');
	delete currLogAcc[ID];
	var currLogReq = getJSONValue(requester,'log');
	delete currLogReq[ID];
	changeJSONValue(accepter,'log',currLogAcc);
	changeJSONValue(requester,'log',currLogReq);
}
