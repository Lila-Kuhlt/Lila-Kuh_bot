// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.bday_all."

module.exports = {
    name: 'bday_all',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bdaya', 'bda'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    guild_only: true,
    need_permission: [],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {

    },
};
