// ===============================
// This file provides different useful methods about handling with the database
// ===============================

// -----------------------------------
// Guild
// -----------------------------------
// add the guild from message in the database 'Guild'. Also set prefix to config.prefix
async function create_guild_tag(msg) {
    msg.client.logger.log("info", `try to add guild ${msg.member.guild.name} to database 'Guild'`)

    try {
        await msg.client.DB.Guild.create({
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

    const tag = await msg.client.DB.Guild.findOne({ where: { guild_id: msg.member.guild.id } })

    if (tag) {
        return tag.prefix

    } else {
        msg.client.logger.log("warn",`guild ${msg.member.guild.name} not in database 'Guild'`)
        await create_guild_tag(msg)
        return await get_prefix(msg)
    }
}

// set prefix of the author from message
async function set_prefix(msg, new_prefix) {
    const old_prefix = await get_prefix(msg)
    const new_tag = await msg.client.DB.Guild.update({ prefix: new_prefix }, { where: { guild_id: msg.member.guild.id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("error", `Could not set prefix from ${old_prefix} to ${new_prefix} of guild ${msg.member.guild.name} in database 'Guild'`)
        return false
    }
}
// -----------------------------------



// -----------------------------------
// User_Lang
// -----------------------------------
// add the author from message in the database 'User_Lang'. Also set lang to config.default_lang
async function add_user_lang(msg) {
    msg.client.logger.log("info", `try to add user ${msg.author.username} to database 'User_Lang' (id: ${msg.author.id})`)

    try {
        await msg.client.DB.User_Lang.create({
            user_id: msg.author.id,
            lang: msg.client.config.default_lang
        })
        msg.client.logger.log("info",`user ${msg.author.username} successfully added to database 'User_Lang' (id: ${msg.author.id})`)

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            msg.client.logger.log("warn",`user ${msg.author.username} already exist in database 'User_Lang' (id: ${msg.author.id})`)

        } else {
            msg.client.logger.log("error",`Something went wrong with adding user ${msg.author.username} in database 'User_Lang' (id: ${msg.author.id})`)
        }
    }
}

// get lang of the author from message. If author doesn't exist in database, the author will added into it
async function get_lang(msg) {
    const tag = await msg.client.DB.User_Lang.findOne({ where: { user_id: msg.author.id } })

    if (tag) {
        return tag.lang

    } else {
        msg.client.logger.log("warn",`user ${msg.author.username} not in database 'User_Lang' (id: ${msg.author.id})'`)
        await add_user_lang(msg)
        return await get_lang(msg)
    }
}

// set lang of the author from message
async function set_lang(msg, new_lang) {
    const old_lang = await get_lang(msg)
    const new_tag = await msg.client.DB.User_Lang.update({ lang: new_lang }, { where: { user_id: msg.author.id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("error", `Could not set lang from ${old_lang} to ${new_lang} of user ${msg.author.username} in database 'User_Lang' (id: ${msg.author.id})`)
        return false
    }
}
// -----------------------------------


// -----------------------------------
// Poll
// -----------------------------------
async function add_poll(msg, is_private) {
    try {
        await msg.client.DB.Poll.create({
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

async function get_poll(msg, poll_id) {
    const tag = await msg.client.DB.Poll.findOne({ where: { poll_id: poll_id } })

    if (tag) {
        return tag

    } else {
        msg.client.logger.log("info",`user ${msg.author.username} search non existent poll_id ${poll_id} in database 'Poll' (id: ${msg.author.id})'`)
        return null
    }
}
// -----------------------------------

// -----------------------------------
// Poll
// -----------------------------------
async function add_poll_voted(msg, poll_id, user_id, choices) {
    try {
        await msg.client.DB.Poll_Voted.create({
            poll_id: poll_id,
            user_id: user_id,
            choices: choices
        })
        return true
    } catch (e) {
        msg.client.logger.log("error", `Could not add poll_voted with poll_id ${poll_id} with user ${user_id} with choices ${choices} in database 'Poll_Voted'`)
        msg.client.logger.log("error", e)
        return false
    }
}

async function set_poll_voted(msg, poll_id, user_id, choices) {
    const new_tag = await msg.client.DB.Poll_Voted.update({ choices: choices }, { where: { poll_id: poll_id, user_id: user_id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("error", `Could not set choices for poll_id ${poll_id} and user_id ${user_id} in database 'Poll_Voted'`)
        return false
    }
}

async function get_poll_voted(msg, poll_id, user_id) {
    const tag = await msg.client.DB.Poll_Voted.findOne({ where: { poll_id: poll_id, user_id: user_id } })

    if (tag) {
        return tag

    } else {
        msg.client.logger.log("info",`Could not get choices with poll_id ${poll_id} and user_id ${user_id} in database 'Poll_Voted'`)
        return null
    }
}
// -----------------------------------


module.exports = { add_user: add_user_lang, get_lang, set_lang, get_prefix, set_prefix, get_poll, add_poll,
                    add_poll_voted, set_poll_voted, get_poll_voted }
