import { fetchData } from "./connection.js"
import { correctUnitCustomStat, correctNameCustomStat } from "./util.js"

const statKey = document.location.href.split("?")[1]
const pollingIntervalInSec = 5

document.getElementById("statistic").innerText = correctNameCustomStat(statKey)
document.getElementById("main").style.height = window.innerHeight - document.getElementById("header").offsetHeight - document.getElementById("nav").offsetHeight + "px"

retreiveData()
setInterval(() => retreiveData(), pollingIntervalInSec * 1000)

let playerData

function retreiveData() {
    fetchData()
        .then(data => {
            playerData = data
            populate()
        })
}

function populate() {
    document.getElementById("leaderboard").innerHTML = createLeaderboard()
}

function createLeaderboard() {
    let html = ""

    const playerMap = new Map()

    if (statKey === "minecraft:most_blocks_mined") {
        for (const key in playerData) {
            let totalMined = 0
            for (const item in playerData[key]["stats"]["minecraft:mined"]) {
                totalMined += playerData[key]["stats"]["minecraft:mined"][item]
            }
            playerMap.set(playerData[key]["name"], totalMined)
        }
    } else if (statKey === "minecraft:most_ancient_debris_mined") {
        for (const key in playerData) {
            if (playerData[key]["stats"]["minecraft:mined"]["minecraft:ancient_debris"] !== undefined)
                playerMap.set(playerData[key]["name"], playerData[key]["stats"]["minecraft:mined"]["minecraft:ancient_debris"])
        }
    } else {
        for (const key in playerData) {
            if (playerData[key]["stats"]["minecraft:custom"][statKey] !== 0)
                playerMap.set(playerData[key]["name"], playerData[key]["stats"]["minecraft:custom"][statKey])
        }
    }

    const values = [...playerMap.values()].sort((a, b) => b - a)

    values.forEach((value, index) => {
        const gray = index % 2 == 0 ? "" : ` class="gray"`

        playerMap.forEach((value1, playerName) => {
            if (value === value1) {
                playerMap.delete(playerName)

                html += `<li><img src="https://mc-heads.net/avatar/${playerName}" class="player-heads">
                    <a href="${document.location.href.split("leaderboard.html")[0]}player.html?${playerName}"><h3${gray}>${playerName}</h3></a>
                    <h3${gray}>${Object.values(correctUnitCustomStat(statKey, value))[0]}</h3></li>`
            }
        })
    })

    return html
}

window.onresize = () => location.reload()
