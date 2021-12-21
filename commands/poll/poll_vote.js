const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.poll_vote."

module.exports = {
    name: 'poll_vote',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['pv', 'pollv', 'pollvote'],
    args_needed: true,
    args_min_length: 2,
    args_max_length: 2,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    dm_only: true,
    need_permission: ['ADD_REACTIONS'],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {

    },
};