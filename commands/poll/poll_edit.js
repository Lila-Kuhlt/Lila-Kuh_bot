const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.poll_edit."

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
        const poll_tag = await msg.client.db_helper.get_poll(msg, poll_id)
        let old_msg

        // ---------------
        // check a bunch of edge cases
        // ---------------
        // check correct id
        if (poll_tag === null) {
            msg.client.output.send(msg, "wrong poll id")
            return

        // check if command is executed in same guild as the poll
        } else if (poll_tag.guild_id !== msg.guildId) {
            msg.client.output.send(msg, "must execute in same guild")
            return

        // check if author of command is permitted to edit command (must be author of poll or server admin)
        } else if ((poll_tag.author_id !== msg.author.id) && !(msg.member.permissions.has("ADMINISTRATOR"))) {
            msg.client.output.send(msg, "You're not authorised to edit this poll (only author of poll or server admin)")
            return
        }

        // check access of message
        try {
            old_msg = await (await msg.guild.channels.fetch(poll_tag.channel_id)).messages.fetch(poll_id)
        } catch (e) {
            msg.client.output.send(msg, "cannot access message")
            msg.client.logger.log("warn", e)
            return
        }
        // ---------------

        const poll_cmd = msg.client.commands.get('poll')
        const title = args.shift()
        const options = args
        const emojis = poll_cmd.generate_emoji(options.length)
        const new_embed = poll_cmd.generate_embed(msg, title, options, emojis)

        if (poll_tag.private) {
            new_embed.fields[1] = old_msg.embeds[0].fields[1]
            new_embed.footer = old_msg.embeds[0].footer

        } else {
            new_embed.setFooter("poll_id: " + poll_id)
        }

        msg.client.output.edit(old_msg, { embeds: [new_embed] })
        msg.client.output.send(msg, { embeds: [poll_cmd.generate_success_embed(old_msg.url)]})
    }
};
