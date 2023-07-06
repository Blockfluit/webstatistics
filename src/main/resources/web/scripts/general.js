import { fetchDataPlayer } from "./connection.js"
import { correctUnitCustomStats } from "./util.js"

const playerName = document.location.href.split("?")[1]
const pollingIntervalInSec = 5

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

function retreiveData() {
    fetchDataPlayer(playerName)
        .then(data => {
            let online = data["online"]

            if (online || initialized === false) {
                initialized = true
                stats = correctUnitCustomStats(data["stats"]["minecraft:custom"])
                populate()
            }
        })
}

function populate() {
    document.getElementById("list").innerHTML = createList()
}

function createList() {
    let html = ""

    Object.keys(stats).sort().forEach((key, index) => {
        let statName = key
        let gray = index % 2 == 0 ? "" : ` class="gray"`

        html += `<li${gray}><h3 style="text-transform:capitalize;">${statName}</h3><h3>${stats[key]}</h3></li>`
    })
    return html
}

const buttons = document.getElementsByClassName("nav-button")
for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].href == "") buttons[i].href = `${document.location.href.split("general.html")[0]}${buttons[i].id}.html?${playerName}`
}

window.onresize = () => location.reload()
