var express = require('express'),
    fs = require('fs-plus'),
    path = require('path');

var app = express();

app.use('/', express.static(__dirname + '/static'));

app.get('/api/file/ls', function (request, response) {
    var dirPath = request.query.dirPath || fs.getHomeDirectory(),
        parentPath = path.join(dirPath, '..'),
        files;

    try {
        files = fs.listSync(dirPath); // @todo use async
    } catch (e) {
        if (e.code === 'EACCES') {
            response.status(403).end();
        } else {
            throw e;
        }
        return;
    }

    response.json({
        dirPath: dirPath,
        parentPath: parentPath !== dirPath ? parentPath : null,
        files: files
            .map(function (_path) {
                var ext = path.extname(_path),
                    name = path.basename(_path, ext),
                    stat = fs.statSync(_path);

                return {
                    path: _path,
                    filename: path.basename(_path),
                    name: name, // @todo redundant
                    ext: ext.substr(1), // @todo redundant
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
