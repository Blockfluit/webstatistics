import { fetchData } from "./connection.js"
import leaderboardMap from "./leaderboardMap.js"
import { correctUnitCustomStat } from "./util.js"

const pollingIntervalInSec = 5
document.getElementById("main").style.height = window.innerHeight - document.getElementById("header").offsetHeight - document.getElementById("nav").offsetHeight + "px"

let players
let playerData

setData()
setInterval(() => setData(), pollingIntervalInSec * 1000)

function setData() {
    fetchData().then(data => {
        playerData = data
        players = []
        for (const key in data) {
            players.push(data[key]["name"])
        }
        players.sort()
        populate()
    })
}

function populate() {
    document.getElementById("players-list").innerHTML = createPlayerList()
    document.getElementById("leaderboard").innerHTML = createLeaderboard()
}

function createLeaderboard() {
    let html = ""

    leaderboardMap.forEach((statKey, statName) => {
        let playerName = undefined
        let count = 0

        switch (statKey) {
            case "minecraft:most_blocks_mined":
                for (const key in playerData) {
                    if (playerData[key]["stats"]["minecraft:mined"] !== undefined) {
                        let currentCount = 0

                        Object.values(playerData[key]["stats"]["minecraft:mined"])
                            .forEach(value => currentCount += value)
                        if (currentCount > count) {
                            count = currentCount
                            playerName = playerData[key]["name"]
                        }
                    }
                }
                break
            case "minecraft:most_ancient_debris_mined":
                for (const key in playerData) {
                    if (playerData[key]["stats"]["minecraft:mined"] !== undefined) {
                        const currentCount = playerData[key]["stats"]["minecraft:mined"]["minecraft:ancient_debris"]

                        if (currentCount > count) {
                            count = currentCount
                            playerName = playerData[key]["name"]
                        }
                    }
                }
                break
            default:
                for (const key in playerData) {
                    if (playerData[key]["stats"]["minecraft:custom"] !== undefined) {
                        const currentCount = playerData[key]["stats"]["minecraft:custom"][statKey]

                        if (currentCount > count) {
                            count = currentCount
                            playerName = playerData[key]["name"]
                        }
                    }
                }
                break
        }


        const corrected = correctUnitCustomStat(statKey, count)
        const url = document.location.href.includes("/index.html") ?
            document.location.href.split("index.html")[0] :
            document.location.href

        html += `<div><dt><a href="${url}leaderboard.html?${statKey}"><h4>${statName}</h4></a></dt>`

        if (playerName !== undefined) {
            html += `<dd><img src=https://mc-heads.net/avatar/${playerName}>
            <a href="${url}player.html?${playerName}"><h4>${playerName}:</h4></a>
            <h4 class="leaderboard-value">${Object.values(corrected)[0]}</h4></dd></div>`
        } else {
            html += `<dd><h4>Nobody</h4>
            <h4 class="leaderboard-value">${Object.values(corrected)[0]}</h4></dd></div>`
        }
    })

    return html
}

function createPlayerList() {
    let html = ""

    players.forEach((playerName) => {
        const online = Object.values(playerData)
            .find(entry => entry.name == playerName)["info"]["online"]
        const isOp = Object.values(playerData)
            .find(entry => entry.name == playerName)["info"]["isOp"]
        const url = document.location.href.includes("/index.html") ?
            `${document.location.href.split("index.html")[0]}player.html?${playerName}` :
            `${document.location.href}player.html?${playerName}`

        html += `<li>
        <a href="${url}">
        <h4 ${isOp ? "style=color:crimson" : ""}>${playerName}</h4>
        <h5 style="color:${online ? "lawngreen" : "gray"}">${online ? "online" : "offline"}</h5>
        </a>
        </li>`
    })

    return html
}

window.onresize = () => location.reload()