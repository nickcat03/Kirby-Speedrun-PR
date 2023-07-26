const express = require('express')
const path = require('path');
const cors = require('cors'); //security protection
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '.', 'public')));

app.get('/hi', function (req, res) {
  res.send("hello")
})

//json: https://github.com/speedruncomorg/api/blob/master/version1/users.md

app.get('/test', function (req, res) {
    var runners = {}

    // call src for all the data you need right off the gate
    // once you have all the data, then you can just refer to it locally
    // instead of making a bunch of calls

    // grab the list of runners from src that ran kss any
    populateUsers(runners)
    .then(users => {
        // 1: Change names into user IDs so they can be searched on the leaderboard
        assignUserID(users)
        .then(IDresult => {
            // 2: pull data from src for KSS Any% leaderboard data
            assignUserTime(IDresult)
            .then(timeResult => {
                // 3: emit finished result object
                res.send(timeResult)
            })
        })
    })
})

// Change names into user IDs so they can be searched on the leaderboard
var assignUserID = async (users) => {
    let userObject = Object.keys(users)

    // iterate through the list of users
    for (let i = 0; i < userObject.length; i++) {
        // pull data from src for userdata
        await axios(`https://www.speedrun.com/api/v1/users/${userObject[i]}`)
        .then(async (result) => {
            users[userObject[i]].UserID = result.data.data.id
        })
    }
    return users
}

// assign time data to each user
var assignUserTime = async (users) => {
    let userObject = Object.keys(users)

    // pull data from src for KSS leaderboard
    await axios('https://www.speedrun.com/api/v1/leaderboards/l3dxny1y/category/wkpy9wkr') //URL goes to KSS Any% leaderboard data
    .then(async (result) => {
        for (let j = 0; j < result.data.data.runs.length; j++) {
            let currentRun = result.data.data.runs[j].run

            // Find the player ID for the run that is currently being searched.
            let currentID = currentRun.players[0].id

            // iterate through the list of users
            for (let i = 0; i < userObject.length; i++) {
                // Compare ID to the IDs that we want to find
                if (users[userObject[i]].UserID == currentID) {
                    users[userObject[i]].Time = currentRun.times.primary_t //if an ID matches, we assign that users time to the array
                }
            }
        }
    })

    return users
}

// populate users with runners
var populateUsers = async (users) => {
    // make an axios call to kss any leaderboard
    await axios('https://www.speedrun.com/api/v1/leaderboards/l3dxny1y/category/wkpy9wkr') //URL goes to KSS Any% leaderboard data
    .then(async (result) => {
        // go through the list of all the runs
        let allRuns = result.data.data.runs
        for (let i = 0; i < allRuns.length; i++) {
            // pull the user ID for each player
            let userID = allRuns[i].run.players[0].id
            if (userID === undefined || userID === "qjnze64j") {
                continue
            }
            // convert user ID to a name
            await axios(`https://www.speedrun.com/api/v1/users/${userID}`)
            .then(result => {
                let username = result.data.data.names.international
                // stuff it into our user object
                users[username] = {}
            })
        }
    })
    return users
}

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.listen(3000);