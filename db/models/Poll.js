// ---------------------------------------------
// Model
// ---------------------------------------------
const _TABLE = (sequelize, Sequelize) => {
    return sequelize.define('Poll', {
        poll_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        guild_id: Sequelize.STRING,
        channel_id: Sequelize.STRING,
        author_id: Sequelize.STRING,
        private: Sequelize.BOOLEAN
    }, {
        timestamp: false
    })
}
// ---------------------------------------------


// ---------------------------------------------
// Helper
// ---------------------------------------------
async function add(msg, is_private) {
    try {
        await msg.client.DB.Poll.TABLE.create({
            poll_id: msg.id,
            guild_id: msg.guildId,
            channel_id: msg.channelId,
            author_id: msg.author.id,
            private: is_private
        })
        return true
    } catch (e) {
        msg.client.logger.log("error", `Could not add poll with poll_id ${msg.id} in guild ${msg.guild.name} in channel ${msg.channel.name} from ${msg.author.username} in database 'Poll' (id: ${msg.author.id})`)
        msg.client.logger.log("error", e)
        return false
    }
}

async function get(msg, poll_id) {
    const tag = msg.client.DB.Poll.TABLE.findOne({ where: { poll_id: poll_id } })

    if (tag) {
        return tag

    } else {
        msg.client.logger.log("info",`user ${msg.author.username} search non existent poll_id ${poll_id} in database 'Poll' (id: ${msg.author.id})'`)
        return null
    }
}


async function set(msg, new_content) {

}

async function remove(msg, guild_id) {

}
// ---------------------------------------------


module.exports = { _TABLE, add, get, set, remove }
