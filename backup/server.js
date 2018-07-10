const _ = require('lodash');
const CronJob = require('cron').CronJob;
const teams = require('testsocket-teams');
const redis = require('redis');
const AWS = require('aws-sdk');

const redisClient = redis.createClient('6379', 'redis');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();

const allTeams = Object.assign({}, teams.allBaseball, teams.allHockey, teams.allBasketball, teams.allWorldCup);

function writeToDatabase(team, dateString, subMap, i) {
    setTimeout(() => dynamodb.put({
        TableName: process.env.AWS_TABLE_NAME,
        Item: {
            "Team": team,
            "Date": dateString,
            "Scores": subMap
        }
    }, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item: " + team + ' ' + dateString);
            redisClient.lpush('dates:' + team, dateString)
        }
    }), i * 500);
}

new CronJob('0 5 9 * * *', function() {
    let currDate = new Date();
    currDate = new Date(Date.UTC(currDate.getUTCFullYear(), currDate.getUTCMonth(), currDate.getUTCDate() - 1, currDate.getUTCHours()))
    currDate.setHours(currDate.getHours() - 9)
    const dateString = currDate.toISOString().substr(0, 10)

    var i = 0;

    Object.keys(allTeams).forEach(team => {
        redisClient.hgetall('scores:' + team, function(err, replies) {
            if (!_.isEmpty(replies)) {
                const scoreMap = replies;
                const positive = scoreMap['positive'] || 0
                const negative = scoreMap['negative'] || 0
                if (scoreMap.hasOwnProperty('positive')) delete scoreMap['positive']
                if (scoreMap.hasOwnProperty('negative')) delete scoreMap['negative']

                if ((parseInt(positive, 10) + parseInt(negative, 10)) > 500) {
                    let subMap = scoreMap;
                    const topPlayers = Object.keys(subMap).sort((a, b) => Math.abs(parseInt(subMap[b], 10)) - Math.abs(parseInt(subMap[a], 10))).slice(0, 5)
                    subMap = _.pick(subMap, topPlayers)
                    subMap['positive'] = positive;
                    subMap['negative'] = negative;

                    writeToDatabase(team, dateString, subMap, i);

                    i = i + 1;
                }
            }
            redisClient.del('scores:' + team)
        })
    })
}, null, true, 'Etc/UTC');
