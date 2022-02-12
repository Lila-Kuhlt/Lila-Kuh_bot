// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.info."

module.exports = {
    name: 'info',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['i', 'status'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    guild_only: true,
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {
        msg.client.output.send(msg, { embeds: [await this.generate_embed(msg)] })
    },
    async generate_embed(msg) {
        return msg.client.helper.create_default_embed_big(msg.client)
            .setTitle(await gt(msg, `${s}embed.title`))
            .setFields(await this.generate_server_field(msg),
                await this.generate_general_field(msg))
    },
    async generate_general_field(msg) {
        const values = []

        values.push(await gt(msg, `${s}embed.general.servers`, (await msg.client.DB.Guild.get_guild_ids(msg.client)).length))
        values.push(await gt(msg, `${s}embed.general.users`, (await msg.client.DB.User_Lang.get_user_ids(msg.client)).length))

        return { name: await gt(msg, `${s}embed.general.name`), value: values.join("\n") }
    },
    async generate_server_field(msg) {
        const values = []
        values.push(await gt(msg, `${s}embed.server.prefix`, await msg.client.DB.Guild.get_prefix(msg)))

        if (await msg.client.DB.Guild.get_mensa_enabled(msg.client, msg.guildId)) {
            const mensa_channel = await msg.client.DB.Guild.get_mensa_channel_id(msg.client, msg.guildId)
            const mensa_channel_text = await gt(msg, `${s}embed.server.mensa_channel_id`, mensa_channel)
            values.push(await gt(msg, `${s}embed.server.mensa_enabled`, mensa_channel_text))
        } else {
            values.push(await gt(msg, `${s}embed.server.mensa_disabled`))
        }

        if (await msg.client.DB.Guild.get_bday_enabled(msg.client, msg.guildId)) {
            const bday_channel = await msg.client.DB.Guild.get_bday_channel_id(msg.client, msg.guildId)
            const bday_channel_text = await gt(msg, `${s}embed.server.bday_channel_id`, bday_channel)
            values.push(await gt(msg, `${s}embed.server.bday_enabled`, bday_channel_text))
        } else {
            values.push(await gt(msg, `${s}embed.server.bday_disabled`))
        }

        return { name: await gt(msg, `${s}embed.server.name`), value: values.join("\n") }
    }
};
