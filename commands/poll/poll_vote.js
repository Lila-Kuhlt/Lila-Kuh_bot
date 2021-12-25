const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.poll_vote."

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
    async execute(msg, args) {
        const poll_id = args.shift()
        const poll_to_vote = await msg.client.db_helper.get_poll(msg, poll_id)

        if (poll_to_vote === null) {
            msg.client.output.send(msg, "wrong poll id")
            return
        }
        let guild
        try {
            guild = await msg.client.guilds.fetch(poll_to_vote.guild_id)
            await guild.members.fetch(msg.author.id) // test, user is in guild

        } catch (e) {
            msg.client.output.send(msg, "You have to be in the same guild as the poll")
            return
        }

        let old_msg
        try {
            old_msg = await (await guild.channels.fetch(poll_to_vote.channel_id)).messages.fetch(poll_id)
        } catch (e) {
            msg.client.output.send(msg, "cannot access message")
            msg.client.logger.log("warn", e)
            return
        }
        const score = old_msg.embeds[0].fields[1].value
        const index = this.get_index_from_choice(args[0])

        if (index === null) {
            msg.client.output.send(msg, "vote choice must be [a-z] or :regional_indicator_[a-z]:")
            return
        } else if ((index < 0) || (index >= score.split("\n").length)) {
            msg.client.output.send(msg, "you have to vote a exiting option")
            return
        }
        const new_score = this.increment_score(score, index)
        old_msg.embeds[0].fields[1] = {name: "Score", value: new_score, inline: true}

        msg.client.output.edit(old_msg, { embeds: [old_msg.embeds[0]] })
        msg.client.output.send(msg, "success")
    },
    increment_score(old_score, index) {
        const scores = old_score.split("\n")
        scores[index] = (Number.parseInt(scores[index]) + 1) + ""
        return scores.join("\n")
    },
    get_index_from_choice(choice) {
        choice = choice.toLowerCase()
        let char
        if (/:regional_indicator_[a-z]:/.test(choice) && (choice.length === 22)) {
            char = choice[choice.length - 2]

        } else if (/[a-z]/.test(choice) && (choice.length === 1)) {
            char = choice

        } else {
            return null
        }

        return char.charCodeAt(0) - 'a'.charCodeAt(0)
    }
};