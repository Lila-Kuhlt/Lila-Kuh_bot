// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const dayjs = require("dayjs");
const s = "commands.bday_opt_in."

module.exports = {
    name: 'bday_opt_in',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['bdayoi', 'bdoi'],
    args_needed: true,
    args_min_length: 1,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    need_permission: [],
    disabled: false,
    enable_slash: false,
    async execute(msg, args) { // args: YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(args[0])) return await msg.client.output.reply(msg, await gt(msg, `${s}fail.wrong_format`))

        const date = dayjs(args[0], "YYYY-MM-DD")
        if (!date.isValid) return await msg.client.output.reply(msg, await gt(msg, `${s}fail.wrong_format`))
        if (dayjs().isBefore(date)) return await msg.client.output.reply(msg, await gt(msg, `${s}fail.in_future`))


        if (!await msg.client.DB.Bday.set(msg.client, msg.guildId, msg.author.id, date.year(), date.month(), date.date())) {
            await msg.client.DB.Bday.add(msg.client, msg.guildId, msg.author.id, date.year(), date.month(), date.date())
        }

        await msg.client.output.send(msg, await gt(msg, `${s}success`))
    },
};
