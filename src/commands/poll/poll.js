const { MessageEmbed } = require('discord.js');
const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.poll."
const text = {
    prefix: ":regional_indicator_",
    suffix: ":"
}

module.exports = {
    name: 'poll',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['p'],
    args_needed: true,
    args_min_length: 2,
    args_max_length: 21,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: ['SEND_MESSAGES', 'ADD_REACTIONS'],
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {
        // get needed values
        const title = args.shift()
        const options = args
        const emojis = this.generate_emoji(options.length)

        const embed = await this.generate_embed(msg, title, options, emojis)
        let new_msg = await msg.client.output.send(msg, {embeds: [embed], fetchReply: true})
        embed.setFooter({ text: await gt(msg, `${s}embed_footer`, new_msg.id) })
        new_msg = await msg.client.output.edit(new_msg, {embeds: [embed]})
        await this.react(new_msg, emojis)
        await this.add_poll_to_db(new_msg, false)
    },
    emojis: ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'],
    async generate_embed(msg, title, options, emojis) {
        emojis.map(function(emoji, index) {
            return [emoji + " " + options[index]];
        }).join("\n")

        return new MessageEmbed()
            .setColor(msg.client.config.embed.color)
            .setAuthor({ name: msg.client.config.embed.author_name, iconURL: msg.client.config.embed.avatar_url })
            .setTitle(title)
            .addField(await gt(msg, `${s}options`), emojis.map(function(emoji, index) {
                return [emoji + " " + options[index]];
            }).join("\n"), true)
    },
    generate_emoji(count) {
        const emojis = []
        let char_counter = 'a'
        for (let i = 0; i < count; i++) {
            emojis.push(text.prefix + char_counter + text.suffix)
            char_counter = String.fromCharCode(char_counter.charCodeAt(0) + 1)
        }
        return emojis
    },
    async react(msg, emojis) {
        for (let i = 0; i < emojis.length; i++) {
            await msg.react(this.emojis[i])
        }
    },
    async add_poll_to_db(new_msg, is_private) {
        await new_msg.client.DB.Poll.add(new_msg, is_private)
    },
    async generate_success_embed(msg, url_to_msg, add_vote) {
        if (add_vote) {
            return new MessageEmbed().setDescription(await gt(msg, `${s}success_add`, url_to_msg))

        } else {
            return new MessageEmbed().setDescription(await gt(msg, `${s}success_remove`, url_to_msg))
        }

    }
};
