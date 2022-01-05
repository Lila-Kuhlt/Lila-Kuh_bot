const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.mensa_disable."

module.exports = {
    name: 'mensa_disable',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['md', 'mensad', 'mensadisable', "mensa_d", "mensa_dis"],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    guild_only: true,
    need_permission: ['ADMINISTRATOR'],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {
        await msg.client.DB.Guild.set_mensa_disable(msg.client, msg.member.guild.id)
        await msg.client.output.send(msg, await gt(msg, s + "success"))
    },
};