var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var actions = require('../common/actions');
const PORT = process.env.PORT || 8080;

app.use('/', express.static(__dirname + '/../public'));

app.get('/status', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(
        getAllPlayers()
    ));
});

server.listen(PORT, function () {
    console.log('Listening on ' + server.address().port);
});
server.lastPlayderID = 0;
io.on('connection', function (socket) {
    socket.on('newplayer', function (data) {
        socket.player = {
            id: server.lastPlayderID++,
            name: data.name,
            action: actions.ACTION_STAY,
            type: data.type,
            x: randomInt(100, 700),
            y: randomInt(100, 600)
        };
        socket.emit('allplayers', getAllPlayers());
        socket.broadcast.emit('newplayer', socket.player);
        socket.emit('myplayer', socket.player.id);
    });
    socket.on('update', function (player) {
        if (socket.player && socket.player !== player) {
            socket.player = Object.assign(socket.player, player);
            socket.broadcast.emit('action', socket.player);
        }
    });
    socket.on('disconnect', function () {
        if (socket.player) {
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
