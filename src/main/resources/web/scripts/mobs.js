import { fetchDataPlayer } from "./connection.js"

const playerName = document.location.href.split("?")[1]
const pollingIntervalInSec = 5
const filter = ["minecraft:killed", "minecraft:killed_by"]

document.getElementById("title").innerText = playerName
document.getElementById("player-name").innerText = playerName
document.getElementById("player-page").href = `/html/player.html?${playerName}`
document.getElementById("icon").href = `https://mc-heads.net/avatar/${playerName}`
document.getElementById("player-head").src = `https://mc-heads.net/avatar/${playerName}`
document.getElementById("list").style.height = window.innerHeight - document.getElementById("header").offsetHeight - document.getElementById("nav").offsetHeight + "px"

retreiveData()
setInterval(() => retreiveData(), pollingIntervalInSec * 1000)

let initialized = false
let stats
let mobs = []

function retreiveData() {
    fetchDataPlayer(playerName)
        .then(data => {
            let online = data["online"]

            if (online || initialized === false) {
                initialized = true
                stats = data["stats"]
                allKeys()
                populate()
            }
        })
}

function populate() {
    document.getElementById("list").innerHTML = createList()
}

function allKeys() {
    filter.forEach(key => {
        if (stats[key] !== undefined)
            Object.keys(stats[key]).forEach(entry => {
                if (!mobs.includes(entry)) mobs.push(entry)
            })
    })
    mobs.sort()
}

function createList() {
    let html = ""

    mobs.forEach(mob => {
        const mobName = mob.split("minecraft:")[1].replace("_", " ")
        const killCount = stats["minecraft:killed"] === undefined ?
            0 : stats["minecraft:killed"][mob] === undefined ?
                0 : stats["minecraft:killed"][mob]
        const killedByCount = stats["minecraft:killed_by"] === undefined ?
            0 : stats["minecraft:killed_by"][mob] === undefined ?
                0 : stats["minecraft:killed_by"][mob]

        const killedMessage = killCount === 0 ?
            `<dd class="gray">Never killed ${mobName}</dd>` :
            `<dd class="lightgray">Killed ${killCount} ${mobName}</dd>`
        const killedByMessage = killedByCount === 0 ?
            `<dd class="gray">Never been killed by ${mobName}</dd>` :
            `<dd class="lightgray">Killed by ${mobName} ${killedByCount} time(s)</dd>`

        html += `<dt>${mobName}</dt>` + killedMessage + killedByMessage
    })
    return html
}

const buttons = document.getElementsByClassName("nav-button")
for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].href == "") buttons[i].href = `${document.location.href.split("mobs.html")[0]}${buttons[i].id}.html?${playerName}`
}

window.onresize = () => location.reload()