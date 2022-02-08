// helper fields
const s = "events."
const schedule = require('node-schedule')

// ---------------------------------
// Export
// ---------------------------------
async function init(client) {
    init_mensa_event(client)
    init_mensa_event(client)
}

async function event_create(msg) {

}
// ---------------------------------


// ----------------------------------
// Inits
// ----------------------------------
function init_mensa_event(client) {
    schedule.scheduleJob('0 0 15 * * 0-4', mensa_event(client)) // So-Do at 15:00 pm
}

function init_bday_event(client) {
    schedule.scheduleJob('0 0 0 * * *', bday_event(client))
}
// ----------------------------------


// ----------------------------------
// Events
// ----------------------------------
function mensa_event(client) {
    return client.mensa_man.post_mensa_plan(client)
}

function bday_event(client) {
    return client.bday_event.post_bday(client)
}
// ----------------------------------


// ----------------------------------
// Checker
// ----------------------------------

// ----------------------------------


module.exports = { init, event_create }
