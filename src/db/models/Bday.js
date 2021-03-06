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
        "year": {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        "month": {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        "day": {
            type: Sequelize.INTEGER,
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
// get all user_ids for a specific guild_id
async function get_user_ids(client, guild_id) {
    const tag = await client.DB["Bday"].TABLE.findAll({attributes: ["user_id"], where: { "guild_id": guild_id }})
    return (tag) ? tag.map(function (e) {
        return e.dataValues.user_id
    }) : []
}

// get all user_ids x guild_ids x year with matching month and date
async function get_guild_user_ids_and_year(client, month, day) {
    const tag = await client.DB["Bday"].TABLE.findAll({attributes: ["guild_id", "user_id", "year"], where: { "month": month, "day": day }})
    return (tag) ? tag.map(function (e) {
        return e.dataValues
    }) : []
}

// add stuff to database
async function add(client, guild_id, user_id, year, month, day) {
    try {
        await client.DB["Bday"].TABLE.create({
            "guild_id": guild_id,
            "user_id": user_id,
            "year": year,
            "month": month,
            "day": day
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
    const tag = await client.DB["Bday"].TABLE.findOne({ where: { "guild_id": guild_id, "user_id": user_id } })
    return (tag) ? tag.dataValues : null
}


// set stuff in database
async function set(client, guild_id, user_id, year, month, day) {
    const new_tag = await client.DB["Bday"].TABLE.update({ "year": year, "month": month, "day": day },
        { where: { "guild_id": guild_id, "user_id": user_id } })

    if (new_tag[0]) {
        return true

    } else {
        client.logger.log("warn", `Could not set ${guild_id} x ${user_id} in database Bday!`)
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


module.exports = { _TABLE, get_user_ids, get_guild_user_ids_and_year, add, get, set, remove }
