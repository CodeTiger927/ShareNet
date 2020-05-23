const data = require("./data/log.json");
function getJSONValue(user){
	var userData = require('./data/' + user + '.json');
	return userData;
}


function changeJSONValue(user, key, value){
	var user = getJSONValue(user);
	user[key] = value;
	writeJSON("./data/userData",username + ".json");
}

function register(username, password){
	
	if exists(username){
		return;
	}

	changeJSONValue(username, 'password', md5(password))
}

//description, sender, accepter
function addRequest(requester, description){
	requestLogData.push([requester, description]);

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
	var currLog = getJSONValue(accepter)['log'];
	currLog.delete(ID);
	changeJSONValue(accepter, 'log', currLog);

}

function findDistance()



