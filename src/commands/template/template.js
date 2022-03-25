// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { MessageEmbed } = require('discord.js');
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
    enable_slash: true,
    async execute(msg, args) {
        if (args.length === 0) await this.post_all_templates(msg)
        else await this.post_given_template(msg, args.shift())
    },
    async post_all_templates(msg) {
        const tags = await msg.client.DB.Template.get_user_entries(msg.client, msg.author.id)
        const description = tags.map(tag => `\`${tag.key}\``).join("\n")

        const embed = new MessageEmbed()
            .setTitle(await gt(msg, s + "embed.all.title"))
            .setDescription(description)
            .setColor(msg.client.config.color)

        msg.client.output.send(msg, { embeds: [embed] })
    },
    async post_given_template(msg, key) {
        const tag = await msg.client.DB.Template.get(msg.client, msg.author.id, key)
        if (!tag) return msg.client.output.reply(msg, await gt(msg, s + "fail.not_found", key))

        const embed = new MessageEmbed()
            .setTitle(await gt(msg, s + "embed.single.title", key))
            .setDescription(`\`\`\`${tag.value}\`\`\``)
            .setColor(msg.client.config.color)

        await msg.client.output.send(msg, { embeds: [embed] })
    }
};
