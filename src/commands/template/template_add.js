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
    enable_slash: false,
    async execute(msg, args) {
        const key = args.shift()
        const value = args.shift()

        if (key.length > 2000 || value.length > 2000) {
            return msg.client.output.reply(msg, await gt(msg, `${s}fail.to_long`))
        }

        if (await msg.client.DB.Template.get(msg.client, msg.author.id, key) !== null) {
            await msg.client.DB.Template.set(msg.client, msg.author.id, key, value)

        } else {
            await msg.client.DB.Template.add(msg.client, msg.author.id, key, value)
        }
    },
};
