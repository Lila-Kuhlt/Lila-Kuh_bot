const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.poll_vote."
const sf = "commands.poll_vote.fail."

module.exports = {
    name: 'poll_vote',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['pv', 'pollv', 'pollvote'],
    args_needed: true,
    args_min_length: 2,
    args_max_length: 2,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    dm_only: true,
    disabled: false,
    enable_slash: false,
    async execute(msg, args, is_unvote) {
        const poll_id = args.shift()
        const poll_to_vote = await msg.client.DB.Poll.get(msg, poll_id)
        const msg_is_button = msg.type === 'MESSAGE_COMPONENT'
        let guild
        let old_msg

        // ---------------
        // check a bunch of edge cases
        // ---------------
        // wrong poll id
        if (poll_to_vote === null) {
            msg.client.output.reply(msg, { content: await gt(msg, `${sf}poll_id`), ephemeral: true })
            return
        }

        // check user is in same guild as the poll
        try {
            guild = await msg.client.guilds.fetch(poll_to_vote.guild_id)
            await guild.members.fetch(msg.author.id) // test, user is in guild

        } catch (e) {
            msg.client.output.reply(msg, { content: gt(msg, `${sf}guild`), ephemeral: true })
            return
        }

        // check, if poll is private
        if (!poll_to_vote.private) {
            msg.client.output.reply(msg, { content: await gt(msg, `${sf}not_private`), ephemeral: true })
            return
        }

        // get old message
        try {
            old_msg = await (await guild.channels.fetch(poll_to_vote.channel_id)).messages.fetch(poll_id)
        } catch (e) {
            msg.client.output.reply(msg, { content: await gt(msg, `${sf}access`), ephemeral: true })
            msg.client.logger.log("warn", e)
            return
        }

        // check, if correct and valid vote_choice was given
        const score = old_msg.embeds[0].fields[1].value
        const index = this.get_index_from_choice(msg, args[0])
        if (index === null) {
            msg.client.output.reply(msg, { content: await gt(msg, `${sf}choice`), ephemeral: true })
            return

        } else if ((index < 0) || (index >= score.split("\n").length)) {
            msg.client.output.reply(msg, { content: await gt(msg, `${sf}choice_out_of_bounce`), ephemeral: true })
            return
        }

        // check, if author of command already voted for this option
        const poll_voted_tag = await msg.client.DB.Poll_Voted.get(msg, poll_id, msg.author.id)
        const poll_tag_user_choice = poll_voted_tag && poll_voted_tag.choices[index]
        if (poll_voted_tag && !msg_is_button && !is_unvote && poll_tag_user_choice) {
            msg.client.output.reply(msg, { content: await gt(msg, `${sf}voted`), ephemeral: true })
            return

        } else if (poll_voted_tag && !msg_is_button && is_unvote && !poll_tag_user_choice) {
            msg.client.output.reply(msg, { content: await gt(msg, `${sf}not_voted`), ephemeral: true })
            return
        }
        // ---------------

        // generate new solution
        const new_score = poll_tag_user_choice ? this.decrement_score(score, index) : this.increment_score(score, index)
        old_msg.embeds[0].fields[1] = {name: await gt(msg, "commands.poll_private.score"), value: new_score, inline: true}

        // set vote in database
        if (poll_voted_tag) {
            poll_voted_tag.choices[index] = !poll_tag_user_choice
            await msg.client.DB.Poll_Voted.set(msg, poll_id, msg.author.id, poll_voted_tag.choices)

        } else {
            const choices = Array(score.length).fill(false)
            choices[index] = true
            await msg.client.DB.Poll_Voted.add(msg, poll_id, msg.author.id, choices)
        }

        // edit poll
        await msg.client.output.edit(old_msg, { embeds: [old_msg.embeds[0]] })

        // send success
        msg.client.output.send(msg, { embeds: [await msg.client.commands.get('poll').generate_success_embed(msg, old_msg.url, !poll_tag_user_choice)], ephemeral: true })

    },
    increment_score(old_score, index) {
        const scores = old_score.split("\n")
        scores[index] = (Number.parseInt(scores[index]) + 1) + ""
        return scores.join("\n")
    },
    decrement_score(old_score, index) {
        const scores = old_score.split("\n")
        scores[index] = (Number.parseInt(scores[index]) - 1) + ""
        return scores.join("\n")
    },
    get_index_from_choice(msg, choice) {
        const emojis = msg.client.commands.get('poll').emojis
        choice = choice.toLowerCase()
        let char
        if (/:regional_indicator_[a-z]:/.test(choice) && (choice.length === 22)) {
            char = choice[choice.length - 2]

        } else if (/[a-z]/.test(choice) && (choice.length === 1)) {
            char = choice

        } else if (emojis.includes(choice)) {
            return emojis.indexOf(choice)

        } else {
            return null
        }

        return char.charCodeAt(0) - 'a'.charCodeAt(0)
    }
};