// ---------------------------------------------
// Model
// ---------------------------------------------
const _TABLE = (sequelize, Sequelize) => {
    return sequelize.define('Poll_Voted', {
        poll_id: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.STRING
        },
        choices: Sequelize.STRING,
    }, {
        timestamp: false
    })
}
// ---------------------------------------------


// ---------------------------------------------
// Helper
// ---------------------------------------------
async function add(msg, poll_id, user_id, choices) {
    try {
        await msg.client.DB.Poll_Voted.TABLE.create({
            poll_id: poll_id,
            user_id: user_id,
            choices: JSON.stringify(choices)
        })
        return true
    } catch (e) {
        msg.client.logger.log("error", `Could not add poll_voted with poll_id ${poll_id} with user ${user_id} with choices ${choices} in database 'Poll_Voted'`)
        msg.client.logger.log("error", e)
        return false
    }
}

async function get(msg, poll_id, user_id) {
    const tag = await msg.client.DB.Poll_Voted.TABLE.findOne({ where: { poll_id: poll_id, user_id: user_id } })

    if (tag) {
        tag.choices = JSON.parse(tag.choices)
        return tag

    } else {
        msg.client.logger.log("info",`Could not get choices with poll_id ${poll_id} and user_id ${user_id} in database 'Poll_Voted'`)
        return null
    }
}

async function set(msg, poll_id, user_id, choices) {
    const new_tag = await msg.client.DB.Poll_Voted.TABLE.update({ choices: JSON.stringify(choices) }, { where: { poll_id: poll_id, user_id: user_id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("warn", `Could not set choices for poll_id ${poll_id} and user_id ${user_id} in database 'Poll_Voted'`)
        return false
    }
}

async function remove(msg, guild_id) {

}
// ---------------------------------------------


module.exports = { _TABLE, add, get, set, remove }
