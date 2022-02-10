const { MessageEmbed } = require('discord.js')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
const objectSupport = require("dayjs/plugin/objectSupport")
dayjs.extend(objectSupport)


// ---------------------------------
// Export
// ---------------------------------
async function post_bday(client) {
    const now = dayjs()
    const tags = await client.DB["Bday"].get_guild_user_ids_and_year(client, now.month(), now.date())
    if (tags.length === 0) return

    for (const tag of tags) {
        // -------------------------
        // Checks
        // -------------------------
        const enabled = await client.DB.Guild.get_bday_enabled(client, tag.guild_id)
        if (!enabled) continue

        const bday_channel_id = await client.DB.Guild.get_bday_channel_id(client, tag.guild_id)
        if (!bday_channel_id) continue

        try {
            const member = await ((await client.guilds.fetch(tag.guild_id)).members.fetch(tag.user_id))
            console.log(member)
        } catch (e) {
            client.DB.Bday.remove(client, tag.guild_id, tag.client_id)
            continue
        }
        // -------------------------

        const embed = generate_embed_success(client, format_bdates(tag))
        await send_success(client, bday_channel_id, embed)
    }
}
// ---------------------------------


// ---------------------------------
// Send
// ---------------------------------
async function send_success(client, bday_channel_id, embed) {
    try {
        const bday_channel = await client.channels.fetch(bday_channel_id)
        const new_msg = await bday_channel.send({ embeds: [embed] })
        await new_msg.react('🎉')
    } catch (e) {
        client.output.log('error', 'Could not send bday-event success')
    }
}
// ---------------------------------


// ---------------------------------
// Embeds
// ---------------------------------
function generate_embed_success(client, description) {
    return new MessageEmbed()
        .setColor(client.config.embed.color)
        .setDescription(description)
}
// ---------------------------------


// ---------------------------------
// Format
// ---------------------------------
function format_bdates(tag) {
    const new_age = dayjs().year() - tag.year - dayjs().isSameOrBefore({ month: tag.month, day: tag.day })
    return `<@${tag.user_id}> hat **heute Geburtstag** und wird **${new_age}** Jahre alt!
            Gratuliere, indem du auf :tada: reagierst!`
}
// ---------------------------------

module.exports = { post_bday }
