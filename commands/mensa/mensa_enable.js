const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.mensa_enable."

module.exports = {
    name: 'mensa_enable',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['me', 'mensae', 'mensaenable', "mensa_e"],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: ['ADMINISTRATOR'],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {

    },
};