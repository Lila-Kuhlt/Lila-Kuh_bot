const { MessageActionRow, MessageButton } = require('discord.js');

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.poll_private."

module.exports = {
    name: 'poll_private',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['pp', 'pollp', 'pollprivate'],
    args_needed: true,
    args_min_length: 2,
    args_max_length: 21,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: ['SEND_MESSAGES', 'ADD_REACTIONS'],
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {
        // get needed values
        const title = args.shift()
        const options = args
        const poll_cmd = msg.client.commands.get('poll')
        const emojis = poll_cmd.generate_emoji(options.length)

        const embed = await poll_cmd.generate_embed(msg, title, options, emojis)
        let new_msg = await msg.client.output.send(msg, {embeds: [embed], fetchReply: true})

        embed.setFooter(await gt(msg, `${s}embed_footer`, await msg.client.DB.Guild.get_prefix(msg), new_msg.id))
        embed.addField(await gt(msg, `${s}score`), new Array(options.length).fill("0").join("\n"), true)
        new_msg = await msg.client.output.edit(new_msg, {embeds: [embed], components: this.generate_buttons(new_msg.id, poll_cmd.emojis, options.length) })
        await poll_cmd.add_poll_to_db(new_msg, true)
    },
    generate_buttons(poll_id, emojis, length) {
        const components = []
        let buttons = []
        for (let i = 0; i < length + 1; i++) {
            if (i !== 0 && (i % 5) === 0) {
                components.push(new MessageActionRow().addComponents(buttons))
                buttons = []

            } else if (i === length) {
                components.push(new MessageActionRow().addComponents(buttons))
                break
            }

            buttons.push(new MessageButton()
                .setEmoji(emojis[i])
                .setCustomId("poll-" + String.fromCharCode(65 + i))
                .setStyle('SECONDARY')
            )
        }

        return components
    }
};