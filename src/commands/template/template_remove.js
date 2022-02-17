// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.template_remove."

module.exports = {
    name: 'template_remove',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['tmp_remove', 'tmp_rm', 'tmpr'],
    args_needed: true,
    args_min_length: 1,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {

    },
};
