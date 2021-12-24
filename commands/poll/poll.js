const { MessageEmbed } = require('discord.js');
const { get_text: gt } = require("../../lang/lang_helper")
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
    args_max_length: 20,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: ['SEND_MESSAGES', 'ADD_REACTIONS'],
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {
        const title = args.shift()
        const options = args
        const emojis = this.generate_emoji(options.length)

        emojis.map(function(emoji, index) {
            return [emoji + " " + options[index]];
        }).join("\n")

        const embed = new MessageEmbed()
            .setColor(msg.client.config.embed.color)
            .setAuthor(msg.client.config.embed.author_name, msg.client.config.embed.avatar_url)
            .setTitle(title)
            .addField("Options", emojis.map(function(emoji, index) {
                return [emoji + " " + options[index]];
            }).join("\n"))

        const new_msg = await msg.client.output.send(msg, {embeds: [embed]})
        this.react(new_msg, emojis)
        await this.add_poll_to_db(new_msg)
        return new_msg
    },
    emojis: ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'],
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
            msg.react(this.emojis[i])
        }
    },
    async add_poll_to_db(new_msg) {
        await new_msg.client.db_helper.add_poll(new_msg)
    }
};
