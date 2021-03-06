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
    start: "https://www.sw-ka.de/de/essen/?d=",
    end: "#fragment-c1-1",
}

// ---------------------------------
// Export
// ---------------------------------
async function post_mensa_plan(client) {
    const guild_ids = await client.DB.Guild.get_guild_ids(client)
    if (!guild_ids.length) return

    const data = await get_meal_json(client, get_meal_api_link())
    let embed
    if (data === null) return // embed = generate_embed_fail(client)
    else {
        const fields = formatted_meals_to_fields(format_meals(data))
        embed = generate_embed_success(client, fields)
    }
    await send_all_success(client, guild_ids, embed)
}
// ---------------------------------



// ---------------------------------
// Send
// ---------------------------------
async function send_all_success(client, guild_ids, embed) {
    for (const guild_id of guild_ids) {
        const enabled = await client.DB.Guild.get_mensa_enabled(client, guild_id)
        if (!enabled) continue

        const mensa_channel_id = await client.DB.Guild.get_mensa_channel_id(client, guild_id)
        if (!mensa_channel_id) continue

        try {
            const mensa_channel = await client.channels.fetch(mensa_channel_id)
            mensa_channel.send({ embeds: [embed] })
        } catch (e) {}
    }
}
// ---------------------------------

// ---------------------------------
// Embeds
// ---------------------------------
// TODO: Text in lang file
function generate_embed_fail(client) {
    return new MessageEmbed()
        .setColor(client.config.embed.color)
        .setAuthor({ name: "Lila Pause", iconURL: client.config.embed.avatar_url })
        .setTitle("Mensa Update Error")
        .setDescription("Keine Mensa Daten für heute :(")
        .setFooter({ text: "Update immer So-Do um 15:00 Uhr für den Folgetag!" })
}

function generate_embed_success(client, fields) {
    return new MessageEmbed()
        .setColor(client.config.embed.color)
        .setAuthor({ name: client.config.embed.author_name, iconURL: client.config.embed.avatar_url })
        .setTitle("Mensa Update für " + get_date())
        .addFields(fields)
        .setURL(get_sw_link())
        .setFooter({ text: "Update immer So-Do um 15:00 Uhr für den Folgetag!" })
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
            if (value.price === null) {
                field_values.push(`${value.name}`)
            } else {
                if (/\d+\.\d\d/.test(value.price)) {
                    field_values.push(`${value.name} (${value.price}€)`)
                } else if (/\d+\.\d/.test(value.price)) {
                    field_values.push(`${value.name} (${value.price}0€)`)
                } else {
                    field_values.push(`${value.name} (${value.price}€)`)
                }
            }
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
    return sw_link.start + get_date() + sw_link.end
}
// ---------------------------------


// ---------------------------------
// API
// ---------------------------------
function get_meal_api_link() {
    return meal_api.start + get_date() + meal_api.end
}

async function get_meal_json(client, api_link) {
    let response

    try {
        response = await axios.get(api_link)
    } catch (error) {
        client.logger.log("error", error)
    }

    return (response === undefined) ? null : response.data
}
// ---------------------------------

module.exports = { post_mensa_plan }
