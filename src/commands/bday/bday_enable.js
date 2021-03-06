// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.bday_enable."

module.exports = {
    name: 'bday_enable',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bdaye', 'bde'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    guild_only: true,
    need_permission: ['ADMINISTRATOR'],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {
        if (!await msg.client.DB.Guild.get_bday_channel_id(msg.client, msg.member.guild.id)) {
            await msg.client.output.reply(msg, await gt(msg, s + "fail.channel_not_set"))
            return
        }

        await msg.client.DB.Guild.set_bday_enable(msg.client, msg.member.guild.id)
        await msg.client.output.send(msg, await gt(msg, s + "success"))
    },
};
