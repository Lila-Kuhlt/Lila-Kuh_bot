const s = ""
const dayjs = require('dayjs')
const axios = require('axios')
const { logger } = require("./logger")

const meal_api = {
    start: "https://openmensa.org/api/v2/canteens/31/days/",
    end: "/meals"
}
const mensa_channel_id = "695664840177352784"
const used_mensa_lines = [
    "Linie 1Gut & Günstig",
    "Linie 2vegane Linie",
    "Linie 3",
    "Linie 4",
    "Linie 5 To-Go",
    "Linie 6"
]

// ---------------------------------
// Export
// ---------------------------------
async function post_mensa_plan(client) {
    const response = await get_meal_json(get_meal_api_link())
    console.log(response)
}
// ---------------------------------



// ---------------------------------
// Send
// ---------------------------------

// ---------------------------------



// ---------------------------------
// API
// ---------------------------------
function get_meal_api_link() {
    return meal_api.start + dayjs().add(1, 'day').format('YYYY-MM-DD') + meal_api.end
}

async function get_meal_json(api_link) {
    let response

    try {
        response = await axios.get(api_link)
    } catch (error) {
        logger.log("error", error)
    }

    return (response === undefined) ? null : response.data
}
// ---------------------------------

module.exports = { post_mensa_plan }
