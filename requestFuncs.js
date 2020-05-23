const data = require("./data/log.json");
var fs = require('fs');


function createFile(location,name) {
	fs.writeFile(location + '/' + name,'',function(err) {
		if(err) {
			throw err;
		}
		console.log("File is created successfully");
	});
}
function createFile(name){
	createFile("./data/userData", name + ".json");
}

function createJSON(name) {
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


createFile("./data/userData","Alex.json");
writeJSON("./data/userData","Alex.json",{"Alex":"Hehhee"});
createJSON(log)


//========================================================



function getJSONValue(user){
	var userData = require('./data/' + user + '.json');
	return userData;
}

function getJSONValue(user, key){
	var userData = require('./data/' + user + '.json');
	return userData[key];
}

function changeJSONValue(user, key, value){
	var user = getJSONValue(user);
	user[key] = value;
	writeJSON("./data/userData",username + ".json");
}

function register(username, password, type){
	if exists(username){return;}
	createJSON(username);
	changeJSONValue(username, 'password', md5(password));
	changeJSONValue(username, 'type', type);
	changeJSONValue(username, 'log', {});
}
function register(username, password, type, location){
	if exists(username){return;}
	CreateFile(username);
	changeJSONValue(username, 'password', md5(password));
	changeJSONValue(username, 'type', type);
	changeJSONValue(username, 'log', {});
	changeJSONValue(username, 'location', location)
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

function findDistance(p1, p2){


}



//AIzaSyADkEWk0rw92U2RLe3_8z0ejK1MQ-mUs9w




