/**
 * Created by hxiao on 15/11/4.
 */
//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');
var storage = require('node-persist');

storage.initSync();

//Lets define a port we want to listen to
const PORT=8080;

//We need a function which handles requests and send response
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

//A sample POST request
dispatcher.onPost("/add", function(req, res) {
    try {
        var item = JSON.parse(req.body);
        if (typeof(item.deviceId) !== 'undefined' &&
            typeof(item.deviceOs) !== 'undefined') {
            storage.setItem(item.deviceId, item.deviceOs, function () {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Registered!');
            });
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Incorrect format!');
        }
    } catch (e) {
        console.log(e);
    }

    console.log("Number of users : " +storage.length());
});

dispatcher.onPost("/getallusers", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(storage.keys()));
});

dispatcher.onGet("/getallusers", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(storage.keys()));
});
