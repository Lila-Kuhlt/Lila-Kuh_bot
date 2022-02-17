// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.template_add."

module.exports = {
    name: 'template_add',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['tmp_add', 'tmpa'],
    args_needed: true,
    args_min_length: 2,
    args_max_length: 2,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {

    },
};
