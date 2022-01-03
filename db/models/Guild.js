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
// add the guild from message in the database 'Guild'. Also set prefix to config.prefix
async function add(msg) {
    msg.client.logger.log("info", `try to add guild ${msg.member.guild.name} to database 'Guild'`)

    try {
        await msg.client.DB.Guild.TABLE.create({
            guild_id: msg.member.guild.id,
            prefix: msg.client.config.prefix,
            mensa_channel_id: null,
            mensa_enabled: false,
            bday_channel_id: null,
            bday_enabled: false
        })
        msg.client.logger.log("info",`guild ${msg.member.guild.name} successfully added to database 'Guild'`)

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            msg.client.logger.log("warn",`guild ${msg.member.guild.name} already exist in database 'Guild'`)

        } else {
            msg.client.logger.log("error",`Something went wrong with adding guild ${msg.member.guild.name} in database 'Guild'`)
        }
    }
}

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
        await add(msg)
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

// get mensa_channel_id of the guild. If guild doesn't exist in database, the guild will add it into the database
async function mensa_get_channel_id(msg) {
    const tag = await msg.client.DB.Guild.TABLE.findOne({ where: { guild_id: msg.member.guild.id } })

    if (tag) {
        return tag.mensa_channel_id

    } else {
        msg.client.logger.log("warn",`guild ${msg.member.guild.name} not in database 'Guild'`)
        await add(msg)
        return await mensa_get_channel_id(msg)
    }
}

// set mensa_channel_id
async function mensa_set_channel_id(msg, new_channel_id) {
    const old_channel_id = await mensa_get_channel_id(msg)
    const new_tag = await msg.client.DB.Guild.TABLE.update({ mensa_channel_id: new_channel_id }, { where: { guild_id: msg.member.guild.id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("error", `Could not set mensa_channel_id from ${old_channel_id} to ${new_channel_id} of guild ${msg.member.guild.name} in database 'Guild'`)
        return false
    }
}

// set prefix of the author from message
async function mensa_enable(msg) {
    const new_tag = await msg.client.DB.Guild.TABLE.update({ mensa_enable: true }, { where: { guild_id: msg.member.guild.id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("warn",`guild ${msg.member.guild.name} not in database 'Guild'`)
        await add(msg)
        return await mensa_enable(msg)
    }
}

// set prefix of the author from message
async function mensa_disable(msg) {
    const new_tag = await msg.client.DB.Guild.TABLE.update({ mensa_enable: false }, { where: { guild_id: msg.member.guild.id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("warn",`guild ${msg.member.guild.name} not in database 'Guild'`)
        await add(msg)
        return await mensa_enable(msg)
    }
}

async function remove(msg, guild_id) {

}
// ---------------------------------------------


module.exports = { _TABLE, add, get_prefix, set_prefix, mensa_get_channel_id, mensa_set_channel_id, mensa_enable, mensa_disable }
