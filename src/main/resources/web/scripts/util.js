export function formatTime(ticks) {
    const day = 20 * 60 * 60 * 24
    const hour = 20 * 60 * 60
    const minute = 20 * 60
    const second = 20

    if (ticks > day) {
        return `${(ticks / day).toFixed(2)} d`
    } else if (ticks > hour) {
        return `${(ticks / hour).toFixed(2)} h`
    } else if (ticks > minute) {
        return `${(ticks / minute).toFixed(2)} m`
    } else {
        return `${(ticks / second).toFixed(2)} s`
    }

    // let h = Math.floor(ticks / 20 / 3600).toLocaleString('en-US', {
    //     minimumIntegerDigits: 2,
    //     useGrouping: false
    // })
    // let m = Math.floor(ticks / 20 % 3600 / 60).toLocaleString('en-US', {
    //     minimumIntegerDigits: 2,
    //     useGrouping: false
    // })
    // let s = Math.floor(ticks / 20 % 3600 % 60).toLocaleString('en-US', {
    //     minimumIntegerDigits: 2,
    //     useGrouping: false
    // })

    // return `${h}:${m}:${s}`
}

export function toRoman(int) {
    switch (int) {
        case 1:
            return "I"
        case 2:
            return "II"
        case 3:
            return "III"
        case 4:
            return "IV"
        case 5:
            return "V"
        default:
            return "NotValid"
    }
}

export function correctUnitCustomStat(key, value) {
    let tempStatistics = {}
    const newKey = correctNameCustomStat(key)

    if (key.includes("one_cm")) {
        if (value > (100 * 1000)) {
            tempStatistics[newKey] = `${(value / (100 * 1000)).toFixed(2)} km`
        } else if (value > 100) {
            tempStatistics[newKey] = `${(value / 100).toFixed(2)} m`
        } else {
            tempStatistics[newKey] = `${value.toFixed(2)} cm`
        }
    } else if (key.includes("time")) {
        tempStatistics[newKey] = formatTime(value)
    } else if (key.includes("damage")) {
        tempStatistics[newKey] = `${(value / 200).toFixed(0)}<img src="/assets/heart.png" class="heart">`
    } else {
        tempStatistics[newKey] = value
    }

    return tempStatistics
}

export function correctUnitCustomStats(statistics) {
    let tempStatistics = {}

    for (const key in statistics) {
        const corrected = correctUnitCustomStat(key, statistics[key])
        tempStatistics[Object.keys(corrected)[0]] = Object.values(corrected)[0]
    }
    return tempStatistics
}

export function correctNameCustomStat(key) {
    if (key.includes("interact")) return `interactions ${key.split("interact")[1].replaceAll("_", " ")}`

    switch (key) {
        case "minecraft:armor_cleaned":
            return "armor pieces cleaned"
        case "minecraft:banner_cleaned":
            return "banners cleaned"
        case "minecraft:aviate_one_cm":
            return "distance by elytra"
        case "minecraft:walk_one_cm":
            return "distance walked"
        case "minecraft:climb_one_cm":
            return "distance climbed"
        case "minecraft:horse_one_cm":
            return "distance by horse"
        case "minecraft:fly_one_cm":
            return "distance flown"
        case "minecraft:fall_one_cm":
            return "distance fallen"
        case "minecraft:crouch_one_cm":
            return "distance crouched"
        case "minecraft:sprint_one_cm":
            return "distance sprinted"
        case "minecraft:swim_one_cm":
            return "distance swum"
        case "minecraft:minecart_one_cm":
            return "distance by cart"
        case "minecraft:boat_one_cm":
            return "distance by boat"
        case "minecraft:walk_on_water_one_cm":
            return "distance walked on water"
        case "minecraft:walk_under_water_one_cm":
            return "distance walked under water"
        case "minecraft:strider_one_cm":
            return "distance by strider"
        case "minecraft:pig_one_cm":
            return "distance by pig"
        case "minecraft:drop":
            return "items dropped"
        case "minecraft:enchant_item":
            return "items enchanted"
        case "minecraft:jump":
            return "jumps"
        default:
            return key.split("minecraft:")[1].replaceAll("_", " ")
    }
}