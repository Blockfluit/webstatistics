const production = true
const url = production ? document.location.href.split("/")[0] + "/user?name=" : "http://127.0.0.1:8234/user?name="

export async function fetchData() {
    const response = await fetch(url, { method: "GET" })
    const json = await response.json()
    return json
}

export async function fetchDataPlayer(name) {
    const response = await fetch((url + name), { method: "GET" })
    const json = await response.json()
    return json
}
