const { logger } = require("./logger")
const { MessageEmbed } = require('discord.js')

const dayjs = require('dayjs')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)
const axios = require('axios')

const meal_api = {
    start: "https://openmensa.org/api/v2/canteens/31/days/",
    end: "/meals"
}
const sw_link = {
    start: "https://www.sw-ka.de/de/essen/?kw=",
    mid: "#fragment-c1-",
}

const mensa_channel_id = "695664840177352784"

// ---------------------------------
// Export
// ---------------------------------
async function post_mensa_plan(client) {
    const data = await get_meal_json(get_meal_api_link())

    if (data === null) send_fail(client)
    else {
        const fields = formatted_meals_to_fields(format_meals(data))
        send_success(client, fields)
    }
}
// ---------------------------------



// ---------------------------------
// Send
// ---------------------------------
async function send_fail(client) {
    const channel = client.channels.cache.get(mensa_channel_id)
    const embed = new MessageEmbed()
        .setColor(client.config.embed.color)
        .setAuthor("Lila Pause", client.config.embed.avatar_url)
        .setTitle("Mensa Update Error")
        .setDescription("Keine Mensa Daten für heute :(")
        .setFooter("Update immer So-Do um 15:00 Uhr für den Folgetag!")

    channel.send({ embeds: [embed] })
}

async function send_success(client, fields) {
    const channel = client.channels.cache.get(mensa_channel_id)
    const embed = new MessageEmbed()
        .setColor(client.config.embed.color)
        .setAuthor(client.config.embed.author_name, client.config.embed.avatar_url)
        .setTitle("Mensa Update für " + get_date())
        .addFields(fields)
        .setURL(get_sw_link())
        .setFooter("Update immer So-Do um 15:00 Uhr für den Folgetag!")

    channel.send({ embeds: [embed] })
}
// ---------------------------------


// ---------------------------------
// Format
// ---------------------------------
function format_meals(data) {
    const output = {}

    for (const meal of data) {
        if (Object.keys(output).includes(meal.category)) {
            output[meal.category].push(get_meals_name_and_price(meal))

        } else {
            output[meal.category] = [ get_meals_name_and_price(meal) ]
        }
    }
    return output
}

function get_meals_name_and_price(meal) {
    return { name: meal.name, price: meal.prices.students }
}

function formatted_meals_to_fields(meals) {
    const fields = []
    for (const category of Object.keys(meals)) {
        let field_values = []
        for (const value of meals[category]) {
            const price = (value.price === null) ? 0.0 : value.price
            field_values.push(`${value.name} (${price}€)`)
        }
        if (field_values.length === 0) continue

        fields.push({ name: category, value: field_values.join("\n") + "\n" })
    }

    return fields
}
// ---------------------------------


// ---------------------------------
// Date
// ---------------------------------
function get_date() {
    return dayjs().add(1, 'day').format('YYYY-MM-DD')
}

function get_sw_link() {
    const date = get_date()
    const week = dayjs(date).subtract(7, 'day').week()
    const day = dayjs(date).day()

    return sw_link.start + week + sw_link.mid + day
}
// ---------------------------------


// ---------------------------------
// API
// ---------------------------------
function get_meal_api_link() {
    return meal_api.start + get_date() + meal_api.end
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
