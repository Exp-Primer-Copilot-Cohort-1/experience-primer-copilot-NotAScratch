//create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = require('./comments');
var mime = require('mime');
var cache = {};

//create server
var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    var filePath = './public' + pathname;
    serveStatic(res, cache, filePath);
});

//listen port
server.listen(3000, function() {
    console.log('Server listening on port 3000');
});

//serve static files
function serveStatic(res, cache, absPath) {
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(res);
                    } else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            } else {
                send404(res);
            }
        });
    }
}

//send 404 error
function send404(res) {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    res.write('Error 404: resource not found.');
    res.end();
}