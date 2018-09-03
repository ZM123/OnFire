const path = require('path');
const express = require('express');
const redis = require('redis');
const AWS = require('aws-sdk');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io-client');
const emitter = require('socket.io')(server);
const port = 80;

const client = redis.createClient('6379', 'redis', {
    retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            throw new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60 * 10) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            throw new Error('Retry time exhausted');
        }
        // reconnect after
        console.log("Reconnecting, attempt " + options.attempt)
        return Math.min(options.attempt * 1000, 3000);
    }
});

AWS.config.update({
    region: 'us-east-1',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();

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
            console.log('ERR: ' + JSON.stringify(err))
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
            console.log('ERR: ' + JSON.stringify(err))
            res.json([])
        }
    })
})

app.get('/scores/:team/today', (req, res) => {
    client.hgetall('scores:' + req.params.team, function(err, replies) {
        if (replies) {
            const scoreMap = replies;
            const positive = scoreMap['positive']
            const negative = scoreMap['negative']
            delete scoreMap['positive']
            delete scoreMap['negative']
            res.json({ scoreMap, positive, negative })
        } else {
            console.log('ERR: ' + JSON.stringify(err))
            res.json({
                scoreMap: {},
                positive: 0,
                negative: 0
            })
        }
    })
})

app.get('/scores/:team/:date', (req, res) => {
    client.lrange('dates:' + req.params.team, '0', '-1', function(err, replies) {
        if (replies) {
            if (replies.includes(req.params.date)) {
                const params = {
                    TableName: process.env.AWS_TABLE_NAME,
                    Key: {
                        "Team": req.params.team,
                        "Date": req.params.date
                    }
                }
                dynamodb.get(params, function(err, data) {
                    if (err) {
                        console.log("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        const scoreMap = data['Item']['Scores'];
                        const positive = scoreMap['positive']
                        const negative = scoreMap['negative']
                        delete scoreMap['positive']
                        delete scoreMap['negative']
                        res.json({ scoreMap, positive, negative })
                    }
                })
            } else {
                console.log('ERR: Date ' + req.params.date + ' not found for team ' + req.params.team)
                res.json({
                    scoreMap: {},
                    positive: 0,
                    negative: 0
                })
            }
        } else {
            console.log('ERR: ' + JSON.stringify(err))
            res.json({
                scoreMap: {},
                positive: 0,
                negative: 0
            })
        }
    })
})

app.get('/dates/:team', (req, res) => {
    client.lrange('dates:' + req.params.team, '0', '-1', function(err, replies) {
        if (replies) {
            res.json(replies)
        } else {
            console.log('ERR: ' + JSON.stringify(err))
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

    client.hincrby('scores:' + team, player, score)
    if (score >= 0) {
        client.hincrby('scores:' + team, 'positive', 1)
    } else {
        client.hincrby('scores:' + team, 'negative', 1)
    }


    emitter.emit('tweet', tweet);
})
