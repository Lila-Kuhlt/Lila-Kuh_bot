const { get_text: gt } = require("../../lang/lang_man")
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
        const new_mensa_channel_id = args[0]

        // args is a number
        if (new_mensa_channel_id.match(/[^0-9]/)) {
            await msg.client.output.reply(msg, await gt(msg, s + "fail.no_number"))
            return
        }

        // channel exists in same guild#
        let channel
        try {
            channel = await msg.guild.channels.fetch(new_mensa_channel_id)

        } catch (e) {
            await msg.client.output.reply(msg, await gt(msg, s + "fail.wrong_id"))
            return
        }

        await msg.client.DB.Guild.set_mensa_channel_id(msg.client, msg.member.guild.id, new_mensa_channel_id)
        await msg.client.output.send(msg, await gt(msg, s + "success"))
    },
};