// ---------------------------------------------
// Model
// ---------------------------------------------
const _TABLE = (sequelize, Sequelize) => {
    return sequelize.define('Guild', {
        guild_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        prefix: Sequelize.TEXT,
        mensa_channel_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        mensa_enabled: Sequelize.BOOLEAN,
        bday_channel_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        bday_enabled: Sequelize.BOOLEAN
    }, {
        timestamp: false
    })
}
// ---------------------------------------------


// ---------------------------------------------
// Helper
// ---------------------------------------------
// -------------
// General
// -------------
// get all guild_ids
async function get_guild_ids(client) {
    const tag = await client.DB.Guild.TABLE.findAll({attributes: ["guild_id"]})
    return (tag) ? tag.map(function (e) {
        return e.dataValues.guild_id
    }) : []
}


// add the guild from message in the database 'Guild'. Also set prefix to config.prefix
async function add(client, guild_id) {
    client.logger.log("info", `try to add guild ${guild_id} to database 'Guild'`)

    try {
        await client.DB.Guild.TABLE.create({
            guild_id: guild_id,
            prefix: client.config.prefix,
            mensa_channel_id: null,
            mensa_enabled: false,
            bday_channel_id: null,
            bday_enabled: false
        })
        client.logger.log("info",`guild ${guild_id} successfully added to database 'Guild'`)

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            client.logger.log("warn",`guild ${guild_id} already exist in database 'Guild'`)

        } else {
            client.logger.log("error",`Something went wrong with adding guild ${guild_id} in database 'Guild'`)
        }
    }
}

async function remove(client, guild_id) {

}
// -------------


// -------------
// Prefix
// -------------
// get prefix of the guild from message. If guild doesn't exist in database, the guild will added into it
async function get_prefix(msg) {
    if (msg.client.helper.from_dm(msg)) {
        return msg.client.config.prefix
    }

    const tag = await msg.client.DB.Guild.TABLE.findOne({ where: { guild_id: msg.member.guild.id } })

    if (tag) {
        return tag.prefix

    } else {
        msg.client.logger.log("warn",`guild ${msg.member.guild.name} not in database 'Guild'`)
        await add(msg.client, msg.member.guild.id)
        return await get_prefix(msg)
    }
}

// set prefix of the author from message
async function set_prefix(msg, new_prefix) {
    const old_prefix = await get_prefix(msg)
    const new_tag = await msg.client.DB.Guild.TABLE.update({ prefix: new_prefix }, { where: { guild_id: msg.member.guild.id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("error", `Could not set prefix from ${old_prefix} to ${new_prefix} of guild ${msg.member.guild.name} in database 'Guild'`)
        return false
    }
}
// -------------


// -------------
// Mensa
// -------------
// get mensa_channel_id of the guild. If guild doesn't exist in database, the guild will add it into the database
async function get_mensa_channel_id(client, guild_id) {
    const tag = await client.DB.Guild.TABLE.findOne({ where: { guild_id: guild_id } })

    if (tag) {
        return tag.mensa_channel_id

    } else {
        client.logger.log("warn",`guild ${guild_id} not in database 'Guild'`)
        await add(client, guild_id)
        return await get_mensa_channel_id(client, guild_id)
    }
}

// set mensa_channel_id
async function set_mensa_channel_id(client, guild_id, new_channel_id) {
    const old_channel_id = await get_mensa_channel_id(client, guild_id)
    const new_tag = await client.DB.Guild.TABLE.update({ mensa_channel_id: new_channel_id }, { where: { guild_id: guild_id } })

    if (new_tag) {
        return true

    } else {
        client.logger.log("error", `Could not set mensa_channel_id from ${old_channel_id} to ${new_channel_id} of guild ${guild_id} in database 'Guild'`)
        return false
    }
}

async function set_mensa_enable(client, guild_id) {
    const new_tag = await client.DB.Guild.TABLE.update({ mensa_enabled: true }, { where: { guild_id: guild_id } })

    if (new_tag) {
        return true

    } else {
        client.logger.log("warn",`guild ${guild_id} not in database 'Guild'`)
        await add(client, guild_id)
        return await set_mensa_enable(client)
    }
}

async function set_mensa_disable(client, guild_id) {
    const new_tag = await client.DB.Guild.TABLE.update({ mensa_enabled: false }, { where: { guild_id: guild_id } })

    if (new_tag) {
        return true

    } else {
        client.logger.log("warn",`guild ${guild_id} not in database 'Guild'`)
        await add(client, guild_id)
        return await set_mensa_disable(client, guild_id)
    }
}

async function get_mensa_enabled(client, guild_id) {
    const tag = await client.DB.Guild.TABLE.findOne({ where: { guild_id: guild_id } })
    return (tag) ? tag.mensa_enabled : false
}
// -------------
// ---------------------------------------------


module.exports = { _TABLE, add, get_guild_ids, get_prefix, set_prefix,
    get_mensa_channel_id, set_mensa_channel_id, set_mensa_disable, set_mensa_enable, get_mensa_enabled }
