var express = require('express'),
    fs = require('fs-plus'),
    path = require('path');

var app = express();

app.use('/', express.static(__dirname + '/static'));

app.get('/api/file/ls', function (request, response) {
    response.json(
        fs.listSync(fs.getHomeDirectory())
            .map(function (pathname) {
                var ext = path.extname(pathname),
                    name = path.basename(pathname, ext),
                    stat = fs.statSync(pathname);

                  return {
                      name: name,
                      ext: ext,
                      size: stat.size,
                      lastModified: stat.mtime
                  };
            })
    );
});

app.listen(6153, '127.0.0.1');
