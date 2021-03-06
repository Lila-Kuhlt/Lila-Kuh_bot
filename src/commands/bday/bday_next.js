// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const dayjs = require("dayjs")
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
const objectSupport = require("dayjs/plugin/objectSupport")
dayjs.extend(objectSupport)
const { MessageEmbed } = require("discord.js")
const s = "commands.bday_next."

module.exports = {
    name: 'bday_next',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bdayn', 'bdn'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    guild_only: true,
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {
        const user_ids = await msg.client.DB.Bday.get_user_ids(msg.client, msg.guildId)
        const min = { day_distance: 400, user_ids: [-1] } // M = 400
        const now = dayjs()

        for (const user_id of user_ids) {
            try {
                await msg.guild.members.fetch(user_id)
            } catch (e) {
                continue
            }
            const tag = await msg.client.DB.Bday.get(msg.client, msg.guildId, user_id)
            if (tag === null) continue

            const bdate = dayjs({ day: tag.day, month: tag.month })
            const day_distance = dayjs.duration(bdate.diff(dayjs(now))).asDays()
            if (day_distance < 0) continue

            const day_distance_int = parseInt(day_distance)
            if (day_distance_int < min.day_distance) {
                min.day_distance = day_distance_int
                min.user_ids = [user_id]

            } else if (day_distance_int === min.day_distance) {
                min.user_ids.push(user_id)
            }
        }

        if (min.user_ids === [-1]) return await msg.client.output.send(msg, await gt(msg, `${s}fail.nothing_found`))
        for (const user_id of min.user_ids) {
            const format = msg.client.config.date.format
            const tag = await msg.client.DB.Bday.get(msg.client, msg.guildId, user_id)
            const bdate = dayjs({ day: tag.day, month: tag.month, year: tag.year })
            const new_age = dayjs().year() - tag.year - dayjs().isSameOrBefore({ month: tag.month, day: tag.day }) + 1

            const embed = new MessageEmbed()
                .setColor(msg.client.config.embed.color)

            if (min.day_distance === 0) {
                embed.setDescription(await gt(msg, `${s}embed.description_sg`, user_id, new_age, bdate.format(format)))
            } else {
                embed.setDescription(await gt(msg, `${s}embed.description_pl`, user_id, min.day_distance + 1, new_age, bdate.format(format)))
            }
            await msg.client.output.send(msg, { embeds: [embed] })
        }
    },
};
