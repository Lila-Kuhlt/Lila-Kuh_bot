const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.mensa_set_channel."

module.exports = {
    name: 'mensa_set_channel',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['ms', 'mset', 'msc', 'mensas', 'mensa_set', 'mensaset'],
    args_needed: true,
    args_min_length: 1,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: ['ADMINISTRATOR'],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {

    },
};