const path = require('path');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io-client');
const emitter = require('socket.io')(server);
const port = 8000;

let dailyData = {
    all: []
};

app.use(express.static(path.join(__dirname, 'build')));

app.get('/recent/all', (req, res) => {
    res.json(dailyData['all'])
})

app.get('/recent/:team', (req, res) => {
    const recent = dailyData[req.params.team] || []
    res.json(recent)
})

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

server.listen(port);

const socket = io('http://worker:8200');
socket.on('tweet', (tweet) => {
    const { team, player, score } = tweet

    dailyData['all'].unshift({ player, score })
    if (dailyData['all'].length > 200) dailyData['all'].pop()

    const teamRecent = dailyData[team] || []
    teamRecent.unshift({ player, score })
    if (teamRecent.length > 200) teamRecent.pop()
    dailyData[team] = teamRecent
    emitter.emit('tweet', tweet);
})
