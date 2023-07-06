import { fetchDataPlayer } from "./connection.js"

const playerName = document.location.href.split("?")[1]
const filter = ["minecraft:mined", "minecraft:broken", "minecraft:crafted", "minecraft:used", "minecraft:picked_up", "minecraft:dropped"]
const search = document.getElementById("search-value")
const pollingIntervalInSec = 5
const threshold = 1

document.getElementById("title").innerText = playerName
document.getElementById("player-name").innerText = playerName
document.getElementById("player-page").href = `/html/player.html?${playerName}`
document.getElementById("icon").href = `https://mc-heads.net/avatar/${playerName}`
document.getElementById("player-head").src = `https://mc-heads.net/avatar/${playerName}`
document.getElementById("table").style.height = window.innerHeight - document.getElementById("header").offsetHeight - document.getElementById("nav").offsetHeight + "px"

let initialized = false
let stats
let completeTable
let allKeys = []
let filteredKeys = []
let lastIndex = 0
let offset = 0
let reverse = 1

retreiveData()
setInterval(() => retreiveData(), pollingIntervalInSec * 1000)

function retreiveData() {
    fetchDataPlayer(playerName).then(data => {
        let online = data["info"]["online"]

        if (online || (initialized === false)) {
            initialized = true
            stats = []
            filter.forEach(key => {
                let entry = {}
                if (data.stats[key] !== undefined) {
                    entry[key] = Object.entries(data.stats[key])
                } else {
                    entry[key] = []
                }
                stats.push(entry)
            })
            filterKeys()
            setAllKeys()
            completeTable = createTable(allKeys)
            renderTable()
        }
    })
}

function setAllKeys() {
    allKeys = []

    for (let i = 0; i < stats.length; i++) {
        const index = ((i + offset) < stats.length) ? i + offset : i + offset - stats.length
        Object.values(stats[index])
            .forEach(row => {
                row.sort((a, b) => {
                    return b[1] / reverse - a[1] / reverse
                }).forEach(item => {
                    if (allKeys.find(element => element === item[0]) === undefined) allKeys.push(item[0])
                })
            })
    }
}

function filterKeys() {
    filteredKeys = []

    for (let i = 0; i < stats.length; i++) {
        let index = ((i + offset) < stats.length) ? i + offset : i + offset - stats.length
        Object.values(stats[index])
            .forEach(row => row.sort((a, b) => {
                return b[1] / reverse - a[1] / reverse
            }).forEach(item => {
                if (item[0].replaceAll("_", " ").includes(search.value)) {
                    if (filteredKeys.find(element => element === item[0]) === undefined) filteredKeys.push(item[0])
                }
            }))
    }
}

function createTable(keys) {
    let table = ""

    keys.forEach(entry => {
        let row = `<tr><td class="item-frame">
        <img src="/assets/nav/item_background.jpg" class="item-bottom">
        <img src="/assets/items/${entry.replace("minecraft:", "")}.png" title="${entry.replace("minecraft:", "").replaceAll("_", " ")}" class="item-top">
        </td>`
        for (let i = 0; i < stats.length; i++) {
            let item = Object.values(stats[i])[0]
                .find(element => {
                    return element[0] === entry
                })

            let count = 0
            if (item !== undefined) {
                count = item[1]
            }
            row += `<td>${count}</td>`
        }
        row += "</tr>"
        table += row
    })
    return table
}

function setTable(table) {
    const body = document.getElementById("table-body")
    body.innerHTML = table
}

function renderTable() {
    let table = "";
    if (search.value.length <= threshold) {
        table = completeTable
    } else {
        filterKeys()
        table = createTable(filteredKeys)
    }
    setTable(table)
}

function renderTableOnClick(index) {
    offset = index
    if (lastIndex === index) reverse = -reverse
    filterKeys()
    const table = createTable(filteredKeys)
    setTable(table)
    lastIndex = index
}

const buttons = document.getElementsByClassName("nav-button")
for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].href == "") buttons[i].href = `${document.location.href.split("items.html")[0]}${buttons[i].id}.html?${playerName}`
}

const sortButtons = document.getElementsByClassName("sort-button")
for (let i = 0; i < sortButtons.length; i++) {

    const button = sortButtons.item(i)
    button.addEventListener("click", () => {
        sortButtons.item(lastIndex).innerHTML = `<img src="/assets/nav/${sortButtons.item(lastIndex).id.slice(0, -2).replace("-", "_")}.jpg">`
        renderTableOnClick(parseInt(button.id.charAt(button.id.length - 1)))
        button.innerHTML = `<img src="/assets/nav/${button.id.slice(0, -2).replace("-", "_")}.jpg"><img src="/assets/nav/${reverse === 1 ? "arrow_down" : "arrow_up"}.png">`
    })
}

search.onkeyup = () => renderTable()
window.onresize = () => location.reload()