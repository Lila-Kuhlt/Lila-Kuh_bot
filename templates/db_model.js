// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-database
// Sequelize-Types: https://sequelize.org/v5/manual/data-types.html
// Examples: https://discordjs.guide/sequelize/

const NAME = '<NAME>'

// ---------------------------------------------
// Model
// ---------------------------------------------
const _TABLE = (sequelize, Sequelize) => {
    return sequelize.define(NAME, {
        "<attribute1>": {
            type: "<Sequelize-Type>",
            unique: true,
        },
        "<attribute2>": "<Sequelize-Type>",
    }, {
        timestamp: false
    })
}
// ---------------------------------------------


// ---------------------------------------------
// Helper
// ---------------------------------------------
// add stuff to database
async function add(client) {
    try {
        await client.DB[NAME].TABLE.create({
            "<attribute1>": "<value1>",
            "<attribute2>": "<value2>"
        })

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            client.logger.log("warn",`${'<value>'} already exist in database ${NAME}!`)

        } else {
            client.logger.log("error",`Something went wrong with adding this ${'<values>'} in database ${NAME}!`)
        }
    }
}

// get stuff from database
async function get(client) {
    const tag = await client.DB[NAME].TABLE.findOne({ where: { "<attribute1>": "<value1>" } })

    if (tag) {
        return tag.lang

    } else {
        client.logger.log("warn",`${'<value>'} not in database ${NAME}!`)
        await add(client)
        return await get(client)
    }
}


// set stuff in database
async function set(client) {
    const new_tag = await client.DB[NAME].TABLE.update({ "<attribute2>": "<value3>" }, { where: { "<attribute1>": "<value1>" } })

    if (new_tag) {
        return true

    } else {
        client.logger.log("error", `Could not set ${'<value>'} in database ${NAME}!`)
        return false
    }
}

// remove tag in database
async function remove(client) {
    const rowCount = await client.DB[NAME].TABLE.destroy({ where: { "<attribute1>": "<value1>" } })

    if (rowCount) {
        return true

    } else {
        client.logger.log("error", `Could not delete tag with ${'<value>'} in database ${NAME}!`)
        return false
    }
}
// ---------------------------------------------


module.exports = { _TABLE, add, get, set, remove }
