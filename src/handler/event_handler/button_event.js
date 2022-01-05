
// ---------------------------------
// Export
// ---------------------------------
async function interaction_create(interaction) {
    if (interaction.customId.startsWith("poll-")) await button_private_poll(interaction)
    // add more specific button handlers here and below in Specific Button Handlers


}
// ---------------------------------



// ---------------------------------
// Specific Button Handlers
// ---------------------------------
async function button_private_poll(interaction) {
    const poll_id = interaction.message.id
    const vote = interaction.customId.split("-")[1]
    const poll_vote_cmd = interaction.client.commands.get("poll_vote")
    await poll_vote_cmd.execute(interaction.client.slash_event.interaction_to_message(interaction), [poll_id, vote])
}
// ---------------------------------



// ---------------------------------
// Checker
// ---------------------------------

// ---------------------------------

module.exports = { interaction_create }
