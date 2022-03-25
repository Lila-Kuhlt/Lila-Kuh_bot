// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-database
// Sequelize-Types: https://sequelize.org/v5/manual/data-types.html
// Examples: https://discordjs.guide/sequelize/

const NAME = 'Template'

// ---------------------------------------------
// Model
// ---------------------------------------------
const _TABLE = (sequelize, Sequelize) => {
    return sequelize.define(NAME, {
        "user_id": Sequelize.STRING,
        "key": Sequelize.STRING,
        "value": Sequelize.STRING(2000)
    }, {
        timestamp: false
    })
}
// ---------------------------------------------


// ---------------------------------------------
// Helper
// ---------------------------------------------
// add stuff to database
async function add(client, user_id, key, value) {
    try {
        await client.DB[NAME].TABLE.create({
            "user_id": user_id,
            "key": key,
            "value": value
        })

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            client.logger.log("warn",`${user_id} x ${key} already exist in database ${NAME}!`)

        } else {
            client.logger.log("error",`Something went wrong with adding ${user_id} in database ${NAME}!`)
        }
    }
}


// get tag on user_id x key
async function get(client, user_id, key) {
    const tag = await client.DB[NAME].TABLE.findOne({ where: { "user_id": user_id, "key": key } })
    return (tag) ? tag : null
}


// get all entries related to a user_id
async function get_user_entries(client, user_id) {
    const tags = await client.DB[NAME].TABLE.findAll({ where: { "user_id": user_id } })

    return (tags.length !== 0) ? tags.map(function (e) {
        return e.dataValues
    }) : []
}


// set value with corresponding user_id and key
async function set(client, user_id, key, new_value) {
    const new_tag = await client.DB[NAME].TABLE.update({ "value": new_value }, { where: { "user_id": user_id, "key": key } })

    if (new_tag) {
        return true

    } else {
        client.logger.log("error", `Could not set ${new_value} in database ${NAME}!`)
        return false
    }
}

// remove user_id x key in database
async function remove(client, user_id, key) {
    const rowCount = await client.DB[NAME].TABLE.destroy({ where: { "user_id": user_id, "key": key } })

    if (rowCount) {
        return true

    } else {
        client.logger.log("error", `Could not delete tag ${user_id} x ${key} in database ${NAME}!`)
        return false
    }
}
// ---------------------------------------------


module.exports = { _TABLE, add, get, get_user_entries, set, remove }
