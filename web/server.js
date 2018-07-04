const path = require('path');
const express = require('express');
const redis = require('redis');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io-client');
const emitter = require('socket.io')(server);
const port = 8000;

const client = redis.createClient('6379', 'redis');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/recent/all', (req, res) => {
    client.lrange('recent:all', '0', '-1', function(err, replies) {
        if (replies) {
            const scores = replies.map(entry => {
                return {
                    player: entry.split(';')[0],
                    score: parseInt(entry.split(';')[1])
                }
            })
            res.json(scores)
        } else {
            console.log('ERR: ' + err)
            res.json([])
        }
    })
})

app.get('/recent/:team', (req, res) => {
    client.lrange('recent:' + req.params.team, '0', '-1', function(err, replies) {
        if (replies) {
            const scores = replies.map(entry => {
                return {
                    player: entry.split(';')[0],
                    score: parseInt(entry.split(';')[1])
                }
            })
            res.json(scores)
        } else {
            console.log('ERR: ' + err)
            res.json([])
        }
    })
})

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

server.listen(port);

const socket = io('http://worker:8200');
socket.on('tweet', (tweet) => {
    const { team, player, score } = tweet

    client.lpush('recent:all', player + ';' + score)
    client.ltrim('recent:all', '0', '199')

    client.lpush('recent:' + team, player + ';' + score)
    client.ltrim('recent:' + team, '0', '199')

    emitter.emit('tweet', tweet);
})
