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
            prefix: msg.client.config.prefix
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

async function remove(msg, guild_id) {

}
// ---------------------------------------------


module.exports = { _TABLE, add, get_prefix, set_prefix, remove }
