// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.bday_opt_out."

module.exports = {
    name: 'bday_opt_out',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bdayoo', 'bdoo'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    guild_only: true,
    need_permission: [],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {
        if (await msg.client.DB.Bday.remove(msg.client, msg.guildId, msg.author.id)) {
            await msg.client.output.reply(msg, await gt(msg, `${s}success`))

        } else {
            await msg.client.output.reply(msg, await gt(msg, `${s}fail.not_opt_in`))
        }
    },
};
