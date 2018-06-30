import teams from 'testsocket-teams'
import footballColours from './footballteamscolours.json'

const baseballColours = {}
Object.keys(teams.allBaseball).forEach(key => {
    baseballColours[key] = teams.allBaseball[key].colours
})

const basketballColours = {}
Object.keys(teams.allBasketball).forEach(key => {
    basketballColours[key] = teams.allBasketball[key].colours
})

const hockeyColours = {}
Object.keys(teams.allHockey).forEach(key => {
    hockeyColours[key] = teams.allHockey[key].colours
})

const worldcupColours = {}
Object.keys(teams.allWorldCup).forEach(key => {
    worldcupColours[key] = teams.allWorldCup[key].colours
})

export default {
    ...baseballColours,
    ...basketballColours,
    ...footballColours,
    ...hockeyColours,
    ...worldcupColours
}
