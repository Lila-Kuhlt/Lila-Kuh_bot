const { MessageEmbed } = require('discord.js')
const dayjs = require('dayjs')

// ---------------------------------
// Export
// ---------------------------------
async function post_bday(client) {
    const guild_ids = await client.DB.Guild.get_guild_ids(client)
    if (!guild_ids.length) return

    for (const guild_id of guild_ids) {
        const enabled = await client.DB.Guild.get_bday_enabled(client, guild_id)
        if (!enabled) continue

        const bday_channel_id = await client.DB.Guild.get_bday_channel_id(client, guild_id)
        if (!bday_channel_id) continue

        const embed = generate_embed_success(client, bday_channel_id, format_bdates_to_fields(client, guild_id))
        await send_success(client, bday_channel_id, embed)
    }
}
// ---------------------------------


// ---------------------------------
// Send
// ---------------------------------
async function send_success(client, bday_channel_id, embed) {
    if (!bday_channel_id) return

    try {
        const bday_channel = await client.channels.fetch(bday_channel_id)
        bday_channel.send({ embeds: [embed] })
    } catch (e) {
        client.output.log('error', 'Could not send bday-event success')
    }
}
// ---------------------------------


// ---------------------------------
// Embeds
// ---------------------------------
function generate_embed_success(client, fields) {
    return new MessageEmbed()
        .setColor(client.config.embed.color)
        .setAuthor({ name: client.config.embed.author_name, iconURL: client.config.embed.avatar_url })
        .setTitle("Bday Update für " + get_today())
        .addFields(fields)
        .setFooter({ text: "Update immer um Mitternacht im Falle eines Geburtstags!" })
}
// ---------------------------------


// ---------------------------------
// Format
// ---------------------------------
function format_bdates_to_fields(client, guild_id) {
    return ""
}
// ---------------------------------


// ---------------------------------
// Date
// ---------------------------------
function get_today() {
    return dayjs().format('YYYY-MM-DD')
}
// ---------------------------------

module.exports = { post_bday }
