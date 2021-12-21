const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.poll_edit."

module.exports = {
    name: 'poll_edit',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['pe', 'polle', 'polledit'],
    args_needed: true,
    args_min_length: 2,
    usage: async function (msg) { return await gt(msg, s + "usage") },    need_permission: ['MANAGE_MESSAGES', 'ADD_REACTIONS', 'SEND_MESSAGES'],
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {

    },
};