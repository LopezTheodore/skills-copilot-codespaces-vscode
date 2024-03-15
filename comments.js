//Create a web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var comments = [];

var server = http.createServer(function(req, res){
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    if(pathname == '/'){
        fs.readFile('./index.html', function(err, data){
            if(err){
                console.log(err);
            }else{
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        });
    }else if(pathname == '/comment'){
        if(req.method == 'POST'){
            var str = '';
            req.on('data', function(chunk){
                str += chunk;
            });
            req.on('end', function(){
                var obj = qs.parse(str);
                comments.push(obj);
                res.end(JSON.stringify(comments));
            });
        }
    }else if(pathname == '/list'){
        res.end(JSON.stringify(comments));
    }else{
        var file = path.join(__dirname, pathname);
        fs.exists(file, function(exist){
            if(exist){
                fs.readFile(file, function(err, data){
                    if(err){
                        console.log(err);
                    }else{
                        res.end(data);
                    }
                });
            }else{
                res.end('404');
            }
        });
    }
});

server.listen(8080, 'localhost');