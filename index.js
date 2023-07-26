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

    //For the time being, we will manually input values into the code to be calculated here since we lack a front-end
    var users = [
      //[Username, UserID, Time]
        ["Yotta", null, null],
        ["Nippo", null, null]
    ]

    //Change names into user IDs so they can be searched on the leaderboard
    assignUserID(users)

    // pull data from src for KSS Any% leaderboard data
    .then(assignUserTime(users))

    // send response
    res.send(users)
})

// Change names into user IDs so they can be searched on the leaderboard
var assignUserID = (users) => {
    // iterate through the list of users
    for (let i = 0; i < users.length; i++) {
        // pull data from src for userdata
        axios(`https://www.speedrun.com/api/v1/users/${users[i][0]}`)
        .then(result => {
            users[i][1] = result.data.data.id
        })
    }
}

// assign time data to each user
var assignUserTime = (users) => {
    // iterate through the list of users
    for (let i = 0; i < users.length; i++) {
        // pull data from src for KSS leaderboard
        axios('https://www.speedrun.com/api/v1/leaderboards/l3dxny1y/category/wkpy9wkr') //URL goes to KSS Any% leaderboard data
        .then(result => {
            var currentID = ""
            //result.data.data.runs.length
            for (let i = 0; i < 1; i++) { //Loop that lasts for as many runs as there are on the leaderboard
                currentID = result.data.data.runs[i].run.players[0].id; //Find the player ID for the run that is currently being searched.
                for (let j = 0; j < users.length; j++) { //Compare ID to the IDs that we want to find
                    if (users[j][1] == currentID) {
                        users[j][2] = result.data.data.runs[i].run.times.primary_t //if an ID matches, we assign that users time to the array
                    }
                }
            }
        })
    }
}

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.listen(3000);