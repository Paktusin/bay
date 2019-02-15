const express = require('express');
const app = express();
const actions = require('../common/actions');
const https = require('https');
const fs = require('fs');
const http = require('http');
const PORT = process.env.PORT || 8082;

require('dotenv').config();

app.use('/', express.static(__dirname + '/../public'));

app.get('/status', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(
        getAllPlayers()
    ));
});

let server;
if (process.env.SSL_KEY && process.env.SSL_CERT) {
    let https = require('https');
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT)
    };
    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
}
server.lastPlayderID = 0;
server.listen(process.env.PORT || 8082,  () =>console.log('Listening on ' + server.address().port));

let socket;
let io = require('socket.io')
    .listen(server);
io.on('connection', onConnect);

function onConnect(soc) {
    socket = soc;
    socket.on('newplayer', newPlayer);
    socket.on('update',update);
    socket.on('disconnect',disconnect);
}

function disconnect() {
    if (socket.player) {
        io.emit('remove', socket.player.id);
        console.log('disconnect new player id=' + socket.player.id);
    }
}

function update(player) {
    if (socket.player && socket.player !== player) {
        socket.player = Object.assign(socket.player, player);
        socket.broadcast.emit('action', socket.player);
    }
}

function newPlayer(data) {
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
    console.log('connect player id=' + socket.player.id);
}

function getAllPlayers() {
    let players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        let player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function addBot() {

}