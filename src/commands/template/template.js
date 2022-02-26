// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.template."

module.exports = {
    name: 'template',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['tmp'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {
        if (args.length === 0) await this.post_all_templates(msg)
        else await this.post_given_template(msg, args.shift())
    },
    async post_all_templates(msg) {
        const tags = await msg.client.DB.Template.get_user_entries(msg.client, msg.author.id)

        for (const tag of tags) {


        }

    },
    async post_given_template(msg, key) {

    }
};
