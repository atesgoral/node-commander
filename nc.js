var express = require('express'),
    fs = require('fs-plus'),
    path = require('path');

var app = express();

app.use('/', express.static(__dirname + '/static'));

app.get('/api/file/ls', function (request, response) {
    var dirPath = request.query.dirPath || fs.getHomeDirectory();

    console.log(dirPath);

    response.json({
        dirPath: dirPath,
        files: fs.listSync(dirPath) // @todo use async
            .map(function (_path) {
                var ext = path.extname(_path),
                    name = path.basename(_path, ext),
                    stat = fs.statSync(_path);

                return {
                    path: _path,
                    name: name, // @todo redundant
                    ext: ext, // @todo redundant
                    size: stat.size,
                    isDirectory: stat.isDirectory(),
                    lastChanged: stat.ctime,
                    lastAccessed: stat.atime,
                    lastModified: stat.mtime
                };
            })
    });
});

app.listen(6153, '127.0.0.1');
