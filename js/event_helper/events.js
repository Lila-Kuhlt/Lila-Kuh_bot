// helper fields
const s = "events."
const schedule = require('node-schedule')

// ---------------------------------
// Export
// ---------------------------------
async function init(client) {
    init_mensa_event(client)
}

async function event_create(msg) {

}
// ---------------------------------


// ----------------------------------
// Inits
// ----------------------------------
function init_mensa_event(client) {
    schedule.scheduleJob('0 0 6 * * 1-5', mensa_event(client)) // Mo-Fr at 6:00 am
}
// ----------------------------------


// ----------------------------------
// Events
// ----------------------------------
function mensa_event(client) {
    return require("../mensa_manager").post_mensa_plan(client)
}
// ----------------------------------


// ----------------------------------
// Checker
// ----------------------------------

// ----------------------------------


module.exports = { init, event_create }
