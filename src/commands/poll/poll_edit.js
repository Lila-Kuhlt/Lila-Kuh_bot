const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.poll_edit."
const sp = "commands.poll."
const sf = "commands.poll_edit.fail."
const svf = "commands.poll_vote.fail."

module.exports = {
    name: 'poll_edit',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['pe', 'polle', 'polledit'],
    args_needed: true,
    args_min_length: 2,
    args_max_length: 22,
    guild_only: true,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    need_permission: ['MANAGE_MESSAGES', 'ADD_REACTIONS', 'SEND_MESSAGES'],
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {
        const poll_id = args.shift()
        const poll_tag = await msg.client.DB.Poll.get(msg, poll_id)
        let old_msg

        // ---------------
        // check a bunch of edge cases
        // ---------------
        // check correct id
        if (poll_tag === null) {
            msg.client.output.reply(msg, await gt(msg, `${svf}poll_id`))
            return

        // check if command is executed in same guild as the poll
        } else if (poll_tag.guild_id !== msg.guildId) {
            msg.client.output.reply(msg, await gt(msg, `${sf}guild`))
            return

        // check if author of command is permitted to edit command (must be author of poll or server admin)
        } else if ((poll_tag.author_id !== msg.author.id) && !(msg.member.permissions.has("ADMINISTRATOR"))) {
            msg.client.output.reply(msg, await gt(msg, `${sf}authorised`))
            return
        }

        // check access of message
        try {
            old_msg = await (await msg.guild.channels.fetch(poll_tag.channel_id)).messages.fetch(poll_id)
        } catch (e) {
            msg.client.output.reply(msg, await gt(msg, `${svf}access`))
            msg.client.logger.log("warn", e)
            return
        }
        // ---------------

        const poll_cmd = msg.client.commands.get('poll')
        const title = args.shift()
        const options = args
        const emojis = poll_cmd.generate_emoji(options.length)
        const new_embed = await poll_cmd.generate_embed(msg, title, options, emojis)

        if (poll_tag.private) {
            new_embed.fields[1] = old_msg.embeds[0].fields[1]
            new_embed.footer = old_msg.embeds[0].footer

        } else {
            new_embed.setFooter({ text: await gt(msg, `${sp}embed_footer`, poll_id) })
        }

        msg.client.output.edit(old_msg, { embeds: [new_embed] })
        msg.client.output.send(msg, { embeds: [await poll_cmd.generate_success_embed(msg, old_msg.url)]})
    }
};
