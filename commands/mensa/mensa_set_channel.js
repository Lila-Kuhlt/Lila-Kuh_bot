const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.mensa_set_channel."

module.exports = {
    name: 'mensa_set_channel',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['ms', 'mset', 'msc', 'mensas', 'mensa_set', 'mensaset'],
    args_needed: true,
    args_min_length: 1,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: ['ADMINISTRATOR'],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {
        const id = args[0]

        // args is a number
        if (!id.match(/[0-9]+/)) {
            msg.client.output.reply(msg, await gt(msg, s + "fail.no_number"))
            return
        }

        // channel exists in same guild
        const channel = await msg.guild.channels.fetch(id)
        if (!channel) {
            msg.client.output.reply(msg, await gt(msg, s + "fail.wrong_id"))
            return
        }

        await msg.client.DB.Guild.mensa_set_channel_id(msg, id)
        msg.client.output.send(msg, await gt(msg, s + "success"))
    },
};