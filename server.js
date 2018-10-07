var wsServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var ConnectedUser = require('./models/ConnectedUser');

var webSocketsServerPort = process.env.PORT || 8080;;

var server = http.createServer(function(request, response) {
    if(request.url === '/employees'){
        response.writeHead(200, {
            'Content-Type': 'text/json',
            'Access-Control-Allow-Origin': '*',
            'X-Powered-By':'nodejs'
        });
        fs.readFile('data.json', function(err, content){
            response.write(content);
            response.end();
        });
    }
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()).toTimeString() + " Http Server is listening on port " +
        webSocketsServerPort);
});

var wsServer = new wsServer({
    httpServer: server
});

var connections = [];
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    
    connections.push(connection);
    connection.on('message', function(message) {

        var clientObj = message.utf8Data;

        for (var i = 0; i < connections.length; i++) {
            connections[i].sendUTF(clientObj);
        }

        
    });
// connection.on('message', function(message) {
// 	var clientMessage = JSON.parse(message.utf8Data);
 //        switch(clientMessage.action){
 //            case 'ujoined': {

 //                break;
 //            };
 //            case 'sendmes': {

 //                break
 //            };
 //        }
	// });
 //    function addConnection(userId, connectionObj) {
 //        connections.push(new ConnectedUser({id: userId}, connectionObj));
 //    }
 //    function sendMessage(sender, receivers, messageObj) {
 //        for (var i = 0; i < receivers.length; i++) {
 //            receivers[i].connection.sendUTF(messageObj);
 //        }
 //    }
});

var alphabet = 'abcdefghijklmnopqrstuvwxyz';