// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-database
// Sequelize-Types: https://sequelize.org/v5/manual/data-types.html
// Examples: https://discordjs.guide/sequelize/

// ---------------------------------------------
// Model
// ---------------------------------------------
const _TABLE = (sequelize, Sequelize) => {
    return sequelize.define('Bday', {
        "guild_id": {
            type: Sequelize.STRING,
            allowNull: false
        },
        "user_id": {
            type: Sequelize.STRING,
            allowNull: false
        },
        "bdate": { // YYYY-MM-DD
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        timestamp: false
    })
}
// ---------------------------------------------


// ---------------------------------------------
// Helper
// ---------------------------------------------
// add stuff to database
async function add(client, guild_id, user_id, bdate) {
    try {
        await client.DB["Bday"].TABLE.create({
            "guild_id": guild_id,
            "user_id": user_id,
            "bdate": bdate
        })

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            client.logger.log("warn",`${guild_id} x ${user_id} already exist in database Bday!`)

        } else {
            client.logger.log("error",`Something went wrong with adding ${guild_id} x ${user_id} in database Bday!`)
        }
    }
}

// get stuff from database
async function get(client, guild_id, user_id) {
    const tag = await client.DB["Bday"].TABLE.findOne({ where: { "user_id": user_id } })

    if (tag) {
        return tag.lang

    } else {
        client.logger.log("warn",`${guild_id} x ${user_id} not in database Bday!`)
        return null
    }
}


// set stuff in database
async function set(client, guild_id, user_id, bdate) {
    const new_tag = await client.DB["Bday"].TABLE.update({ "bdate": bdate }, { where: { "guild_id": guild_id, "user_id": user_id } })

    if (new_tag) {
        return true

    } else {
        client.logger.log("error", `Could not set ${guild_id} x ${user_id} in database Bday!`)
        return false
    }
}

// remove tag in database
async function remove(client, guild_id, user_id) {
    const rowCount = await client.DB["Bday"].TABLE.destroy({ where: { "guild_id": guild_id, "user_id": user_id } })

    if (rowCount) {
        return true

    } else {
        client.logger.log("error", `Could not delete tag with ${guild_id} x ${user_id}!`)
        return false
    }
}
// ---------------------------------------------


module.exports = { _TABLE, add, get, set, remove }
