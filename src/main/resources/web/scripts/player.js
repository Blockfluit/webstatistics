import { fetchDataPlayer } from "./connection.js"
import { toRoman } from "./util.js"

const playerName = document.location.href.split("?")[1]
const pollingIntervalInSec = 5

document.getElementById("title").innerText = playerName
document.getElementById("player-name").innerText = playerName
document.getElementById("player-page").href = `/html/player.html?${playerName}`
document.getElementById("icon").href = `https://mc-heads.net/avatar/${playerName}`
document.getElementById("player-head").src = `https://mc-heads.net/avatar/${playerName}`
document.getElementById("player-skin").src = `https://minotar.net/armor/body/${playerName}/100.png`
document.getElementById("player-info").style.height = window.innerHeight - document.getElementById("header").offsetHeight - document.getElementById("nav").offsetHeight + "px"

setData()
setInterval(() => setData(), pollingIntervalInSec * 1000)

let online = false
let info = {}

function setData() {
    fetchDataPlayer(playerName).then(data => {
        info = data["info"]
        online = info["online"]
        populate()
    })
}

function populate() {
    document.getElementById("status").innerHTML = online ? `<h2 style="color: lawngreen">online</h2>` : `<h2 style="color: gray">offline</h2>`
    document.getElementById("firstJoined").innerText = new Date(info["startedPlaying"]).toDateString() ?? "never"
    document.getElementById("lastPlayed").innerText = online ? "now" : new Date(info["lastSeen"]).toDateString()
    document.getElementById("level").innerHTML = online ? info["level"] : 0
    document.getElementById("foodLevel").innerHTML = createFoodBar()
    document.getElementById("health").innerHTML = createHealthBar()
    document.getElementById("armour").innerHTML = createArmour()
    document.getElementById("carrying").innerHTML = createCarrying()
}

function createHealthBar() {
    let html = ""

    if (online === true) {
        let health = Math.round(info["health"])

        for (let i = 0; i < Math.floor(10 - health / 2); i++) {
            html += "<img src=/assets/empty_heart.png>"
        }
        if (health % 2 != 0) html += "<img src=/assets/half_heart.png>"
        for (let i = 0; i < Math.floor(health / 2); i++) {
            html += "<img src=/assets/heart.png>"
        }
    } else {
        for (let i = 0; i < 10; i++) {
            html += "<img src=/assets/empty_heart.png>"
        }
    }

    return html
}

function createFoodBar() {
    let html = ""

    if (online === true) {
        let foodLevel = Math.round(info["foodLevel"])

        for (let i = 0; i < Math.floor(10 - foodLevel / 2); i++) {
            html += "<img src=/assets/empty_hunger.png>"
        }
        if (foodLevel % 2 != 0) html += "<img src=/assets/half_hunger.png>"
        for (let i = 0; i < Math.floor(foodLevel / 2); i++) {
            html += "<img src=/assets/hunger.png>"
        }
    } else {
        for (let i = 0; i < 10; i++) {
            html += "<img src=/assets/empty_hunger.png>"
        }
    }

    return html
}

function createArmour() {
    let html = ""

    const armour = online ? Object.keys(info["inventory"]["armour"]) :
        ["minecraft:empty_armor_slot_boots",
            "minecraft:empty_armor_slot_leggings",
            "minecraft:empty_armor_slot_chestplate",
            "minecraft:empty_armor_slot_helmet"]

    armour
        .reverse()
        .forEach(armourPiece => {
            html += `<div class="container-inventory-item">
                <div class="container-inventory-item-left">
                    <img src="/assets/items/${armourPiece.split("minecraft:")[1]}.png">
                </div>`
            if (!armourPiece.includes("empty")) {
                html += `<div class="container-inventory-item-right">`
                html += `<h4 style="color: aqua">${armourPiece.split("minecraft:")[1].replace("_", " ")}</h4>`

                const enchantments = info["inventory"]["armour"][armourPiece]["enchantments"]

                for (const enchant in enchantments) {
                    html += `<h4 style="color: gray">${enchant.split("minecraft:")[1].replace("_", " ")} ${toRoman(enchantments[enchant])}</h4>`
                }

                const maxDurability = info["inventory"]["armour"][armourPiece]["maxDurability"]
                const durability = info["inventory"]["armour"][armourPiece]["maxDurability"] - info["inventory"]["armour"][armourPiece]["damage"] ?? 0

                html += `<h4>Durability: ${durability}/${maxDurability}</h4>`
            }
            html += "</div></div>"
        })
    return html
}

function createCarrying() {
    let html = ""

    const filter = ["mainHand", "offHand"]

    filter.forEach(entry => {
        const item = online ? info["inventory"][entry] : {}
        const itemName = online ? Object.keys(info["inventory"][entry])[0] : "minecraft:air"
        const placeholder = entry === "mainHand" ? "minecraft:empty_slot_sword" : "minecraft:empty_armor_slot_shield"
        const itemPath = itemName === "minecraft:air" ? placeholder : itemName

        html += `<div class="container-inventory-item">
                <div class="container-inventory-item-left">
                    <img src="/assets/items/${itemPath.split("minecraft:")[1]}.png">
                </div>`
        if (!itemName.includes("minecraft:air")) {
            html += `<div class="container-inventory-item-right">`
            html += `<h4 style="color: aqua">${itemName.split("minecraft:")[1].replaceAll("_", " ")}</h4>`

            const enchantments = item[itemName]["enchantments"]

            for (const enchant in enchantments) {
                html += `<h4 style="color: gray">${enchant.split("minecraft:")[1].replaceAll("_", " ")} ${toRoman(enchantments[enchant])}</h4>`
            }

            const maxDurability = item[itemName]["maxDurability"]
            const durability = item[itemName]["maxDurability"] - item[itemName]["damage"] ?? 0

            if (maxDurability !== 0) html += `<h4>Durability: ${durability}/${maxDurability}</h4>`
        }
        html += "</div></div>"
    })
    return html
}

const buttons = document.getElementsByClassName("nav-button")
for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].href == "") buttons[i].href = `${document.location.href.split("player.html")[0]}${buttons[i].id}.html?${playerName}`
}

window.onresize = () => location.reload()