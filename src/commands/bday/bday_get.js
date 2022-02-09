// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.bday_get."
const dayjs = require("dayjs")
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'bday_get',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bdayg', 'bdg'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: [],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {
        let member_id
        if (args.length === 0) {
            member_id = msg.author.id

        } else if (/^<@!?\d+>$/.test(args[0])) {
            member_id = args[0].match(/\d+/)[0]

        } else if (/\d+/.test(args[0])) {
            member_id = args[0]

        } else {
            return await msg.client.output.reply(msg, await gt(msg, `${s}fail.wrong_format`))
        }

        try {
            await msg.guild.members.fetch(member_id)
        } catch (e) {
            return await msg.client.output.reply(msg, await gt(msg, `${s}fail.unknown_user`))
        }

        const bday_tag = await msg.client.DB.Bday.get(msg.client, msg.guildId, member_id)
        if (bday_tag === null) return await msg.client.output.reply(msg, await gt(msg, `${s}fail.user_opt_out`))

        const embed = await this.post_embed_success(msg, member_id, bday_tag.year, bday_tag.month, bday_tag.day)
        await msg.client.output.send(msg, { embeds: [embed] })
    },
    async post_embed_success(msg, bday_member_id, year, month, day) {
        const date = dayjs(new Date(year, month, day))
        const age = dayjs.duration(dayjs().diff(date)).years()
        const format = msg.client.config.date.format
        return new MessageEmbed()
            .setDescription(await gt(msg, `${s}success`, bday_member_id, date.format(format), age))
            .setColor(msg.client.config.embed.color)
    }
};
