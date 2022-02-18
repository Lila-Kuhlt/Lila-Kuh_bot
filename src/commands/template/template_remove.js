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
    enable_slash: false,
    async execute(msg, args) {
        const key = args.shift()

        if (await msg.client.DB.Template.get(msg.client, msg.author.id, key) !== null) {
            await msg.client.DB.Template.remove(msg.client, msg.author.id, key)
            msg.client.output.send(msg, await gt(msg, `${s}success`))

        } else {
            msg.client.output.reply(msg, await gt(msg, `${s}fail.key_not_found`))
        }
    },
};
