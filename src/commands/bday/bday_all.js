// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const dayjs = require("dayjs")
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const s = "commands.bday_all."
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'bday_all',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bdaya', 'bda'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    guild_only: true,
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {
        const user_ids = await msg.client.DB.Bday.get_user_ids(msg.client, msg.guildId)
        const months = new Array(12).fill(0).map(() => { return [] })

        for (const user_id of user_ids) {
            try {
                await msg.guild.members.fetch(user_id)
            } catch (e) {
                continue
            }
            const tag = await msg.client.DB.Bday.get(msg.client, msg.guildId, user_id)
            if (tag === null) continue

            const bdate = dayjs(new Date(tag.year, tag.month, tag.day)).format(msg.client.config.date.format)
            months[tag.month].push(await gt(msg, `${s}embed.bday_entry`, bdate, user_id))
        }

        const embed = new MessageEmbed()
            .setAuthor({ name: msg.client.config.embed.author_name, iconURL: msg.client.config.embed.avatar_url })
            .setColor(msg.client.config.embed.color)
            .setTitle(await gt(msg, `${s}embed.title`))


        for (let i = 0; i < months.length; i++) {
            if (months[i].length === 0) continue

            const month_name = await gt(msg, `${s}months.${i}`)
            months[i].sort()
            embed.addField(month_name, months[i].join("\n"), true)
        }

        msg.client.output.send(msg, { embeds: [embed] })
    },
};
