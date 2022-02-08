// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.bday_opt_in."

module.exports = {
    name: 'bday_opt_in',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bdayoi', 'bdoi'],
    args_needed: true,
    args_min_length: 1,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: [],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {

    },
};
