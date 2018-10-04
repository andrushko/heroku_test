var wsServer = require('websocket').server;
var http = require('http');
var fs   = require('fs');

var webSocketsServerPort = process.env.PORT || 8080;;

var server = http.createServer(function(request, response) {

    response.writeHead(200, {
        'Content-Type': 'text/json',
  		'Access-Control-Allow-Origin': '*',
  		'X-Powered-By':'nodejs'
    });


    fs.readFile('data.json', function(err, content){
        response.write(content);
        response.end();
    });

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
        console.log('res1');
    connections.push(connection);
	connection.on('message', function(message) {

        console.log('res2');
		var clientObj = message.utf8Data;

		for (var i = 0; i < connections.length; i++) {
			connections[i].sendUTF(JSON.stringify(clientObj));
		}

		
	});
});

var alphabet = 'abcdefghijklmnopqrstuvwxyz';