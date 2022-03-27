// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.template_post."

module.exports = {
    name: 'template_post',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['tmp_post', 'tmpp'],
    args_needed: true,
    args_min_length: 2,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {
        const channel_id = args.shift()
        const template_key = args.shift()

        // check, if channel_id exists
        const channel = msg.guild.channels.cache.find(c => c.id === channel_id)
        if (!channel) return await msg.client.output.reply(msg, await gt(msg, s + "fail.channel_not_found"))

        // check, if member has permission to send messages in channel
        if (!channel.permissionsFor(msg.member).has("SEND_MESSAGES")) return await msg.client.output.reply(msg, await gt(msg, s + "fail.no_permission"), channel.id)

        // check, if template_key exists
        const tag = await msg.client.DB.Template.get(msg.client, msg.author.id, template_key)
        if (!tag) return await msg.client.output.reply(msg, await gt(msg, s + "fail.tag_not_found"))

        // send webhook
        const webhook = await channel.createWebhook(msg.member.displayName, {
            avatar: msg.member.displayAvatarURL()
        })
        await webhook.send(msg.client.commands.get("template").set_gaps(tag.value, args))
        setTimeout(function () {
            try {
                webhook.delete()
            } catch (e) {
                msg.client.logger.log("error", e)
            }
        }, 5000)
    },
};
