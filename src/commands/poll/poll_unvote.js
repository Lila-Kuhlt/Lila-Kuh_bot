const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.poll_unvote."

module.exports = {
    name: 'poll_unvote',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['pu', 'puv', "p_uv", 'polluv', 'poll_uv', "punvote", "p_unv"],
    args_needed: true,
    args_min_length: 2,
    args_max_length: 2,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    dm_only: true,
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {
        msg.client.commands.get("poll_vote").execute(msg, args, true)
    },
};