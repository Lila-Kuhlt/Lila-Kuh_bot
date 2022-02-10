// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.bday."
const { MessageEmbed } = require("discord.js")
const dayjs = require("dayjs")
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
const objectSupport = require("dayjs/plugin/objectSupport")
dayjs.extend(objectSupport)
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const horoscope = require("horoscope")

module.exports = {
    name: 'bday',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bd'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {
        // ----------------------------
        // Checker
        // ----------------------------
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
        // ----------------------------

        // success
        const embed = await this.post_embed_success(msg, member_id, bday_tag.year, bday_tag.month, bday_tag.day)
        await msg.client.output.send(msg, { embeds: [embed] })
    },
    async post_embed_success(msg, bday_member_id, year, month, day) {
        return new MessageEmbed()
            .setColor(msg.client.config.embed.color)
            .setAuthor({ name: msg.client.config.embed.author_name, iconURL: msg.client.config.embed.avatar_url })
            .setTitle(await gt(msg, `${s}embed.title`))
            .addFields(
                    await this.generate_general_field(msg, bday_member_id, year, month, day),
                    await this.generate_star_sign_field(msg, month, day),
                    await this.generate_time_calcs_field(msg, bday_member_id, year, month, day),
                )
    },
    async generate_general_field(msg, bday_member_id, year, month, day) {
        const date = dayjs(new Date(year, month, day))
        const age = dayjs().year() - year - dayjs().isSameOrBefore({ month :month, day :day })
        const format = msg.client.config.date.format
        return {
            name: await gt(msg, `${s}embed.fields.general`),
            value: await gt(msg, `${s}success`, bday_member_id, date.format(format), age)
        }
    },
    async generate_star_sign_field(msg, month, day) {
        const sign = horoscope.getSign({ month: (month + 1), day: day })
        const output_sign = await gt(msg, `${s}zodiac.signs.${sign}`)
        const description = await gt(msg, `${s}zodiac.sign_descriptions.${sign}`)
        return {
            name: await gt(msg, `${s}embed.fields.zodiac`, output_sign),
            value: description
        }
    },
    async generate_time_calcs_field(msg, bday_member_id, year, month, day) {
        const date = dayjs({ year: year, month: month, day: day })
        const now = dayjs()
        const diff = dayjs.duration(now.diff(date))
        const days = await gt(msg, `${s}embed.fields.time_calcs.days`, parseInt(diff.asDays()))
        const h = await gt(msg, `${s}embed.fields.time_calcs.h`, parseInt(diff.asHours()))
        const ms = await gt(msg, `${s}embed.fields.time_calcs.ms`, diff.asMilliseconds())
        const join = await gt(msg, `${s}embed.fields.time_calcs.or`)

        return {
            name: await gt(msg, `${s}embed.fields.time_calcs.title`),
            value: await gt(msg, `${s}embed.fields.time_calcs.value`, bday_member_id, [days, h, ms].join(join))
        }
    }
};
