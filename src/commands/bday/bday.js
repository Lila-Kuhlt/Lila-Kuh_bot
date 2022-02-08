// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.bday."

module.exports = {
    name: 'bday',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bday_next', 'bd', 'bdn'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    guild_only: true,
    need_permission: [],
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {

    },
};
