import teams from 'testsocket-teams'

let baseballTeams = {}
Object.keys(teams.allBaseball).forEach(key => {
    baseballTeams[key] = teams.allBaseball[key].fullName
})

let basketballTeams = {}
Object.keys(teams.allBasketball).forEach(key => {
    basketballTeams[key] = teams.allBasketball[key].fullName
})

let hockeyTeams = {}
Object.keys(teams.allHockey).forEach(key => {
    hockeyTeams[key] = teams.allHockey[key].fullName
})

let worldcupTeams = {}
Object.keys(teams.allWorldCup).forEach(key => {
    worldcupTeams[key] = teams.allWorldCup[key].fullName
})

let footballTeams = {}
Object.keys(teams.allFootball).forEach(key => {
    footballTeams[key] = teams.allFootball[key].fullName
})

export default {
    ...baseballTeams,
    ...basketballTeams,
    ...footballTeams,
    ...hockeyTeams,
    ...worldcupTeams,
    ...footballTeams
}

export {
    baseballTeams,
    basketballTeams,
    hockeyTeams,
    worldcupTeams,
    footballTeams
}
