const path = require('path');
const express = require('express');
var Twitter = require('node-tweet-stream')
const Sentiment = require('sentiment')
const _ = require('lodash')
const teams = require('testsocket-teams')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const sentiment = new Sentiment();
const port = 8200;

server.listen(port);

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const sentimentOverrides = {
    beast: 3,
    mvp: 3,
    clutch: 2,
    trash: -3,
    superstar: 1,
    crazy: 0,
    cut: 0,
    deficit: 0,
    fire: 3,
    '🔥': 1,
    cooking: 1,
    safety: 0
}

const tagsToTeam = teams.tagsToTeam;
const rosters = teams.rosters;

const tags = Object.keys(tagsToTeam)

client.track(tags)

client.on('tweet', function (data) {
    const isTweet = _.conformsTo(data, {
      user: _.isObject,
      id_str: _.isString,
      text: _.isString,
    })

    if (isTweet) {
        if (data.text && !data.retweeted_status) {
            tweet = data.text.toLowerCase()
            tags.forEach(tag => {
                if (tweet.includes(tag)) {
                    let mentionedTeam = tagsToTeam[tag];
                    let mentionedPlayer = null;
                    const roster = rosters[mentionedTeam] || []
                    roster.some(name => {
                        if (tweet.includes(name)) mentionedPlayer = name;
                        if (mentionedPlayer) {
                            let score = sentiment.analyze(tweet, { extras: sentimentOverrides }).score
                            if (mentionedPlayer === 'kevin love' || mentionedPlayer === 'kyle love') score -= 3
                            // console.log(tweet + ' ' + score + ' ' + mentionedPlayer)
                            io.emit('tweet', {
                                team: mentionedTeam,
                                player: mentionedPlayer,
                                tweetInfo: {
                                    tweetId: data.id,
                                    username: data.user.name,
                                    screenName: data.user.screen_name,
                                    profilePic: data.user.profile_image_url_https,
                                    text: data.text
                                },
                                score: score
                            });
                        }
                        return !!mentionedPlayer
                    })
                }
            })
        }
    } else {
        if (!data.limit) console.log("OTHER: " + JSON.stringify(data))
    }
});

client.on('warning', function(warning) {
    console.log("WARNING: " + JSON.stringify(warning))
})

client.on('error', function(error) {
    console.log(JSON.stringify(error))
})

client.on('end', function(end) {
    console.log("END: " + JSON.stringify(end))
})
