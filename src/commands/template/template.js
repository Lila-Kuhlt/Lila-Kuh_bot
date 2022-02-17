// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.template."

module.exports = {
    name: 'template',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['tmp'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {

    },
};
