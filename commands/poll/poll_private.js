const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.poll."

module.exports = {
    name: 'poll_private',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['pp', 'pollp', 'pollprivate'],
    args_needed: true,
    args_min_length: 2,
    args_max_length: 21,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: ['SEND_MESSAGES', 'ADD_REACTIONS'],
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {
        await msg.client.commands.get('poll').execute(msg, args, true)
    },
};