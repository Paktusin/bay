var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/assets', express.static(__dirname + '/node_modules'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/status', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(
        getAllPlayers()
    ));
});
server.listen(8081, function () { // Listens to port 8081
    console.log('Listening on ' + server.address().port);
});
server.lastPlayderID = 0;
io.on('connection', function (socket) {
    socket.on('newplayer', function (data) {
        console.log('client call newplayer ' + data.name);
        socket.player = {
            id: server.lastPlayderID++,
            name: data.name,
            x: randomInt(100, 700),
            y: randomInt(100, 600)
        };
        socket.emit('allplayers', getAllPlayers());
        socket.broadcast.emit('newplayer', socket.player);
    });
    socket.on('disconnect', function () {
        if(socket.player){
            console.log('client disconnected ' + socket.player.name);
            io.emit('remove', socket.player.id);
        }
    });
});
function getAllPlayers() {
    var players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        var player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}