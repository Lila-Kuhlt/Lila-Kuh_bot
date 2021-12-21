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
    schedule.scheduleJob('0 0 15 * * 0-4', function () {
        mensa_event(client)
    }) // So-Do at 15:00 pm
}
// ----------------------------------


// ----------------------------------
// Events
// ----------------------------------
function mensa_event(client) {
    return client.mensa_man.post_mensa_plan(client)
}
// ----------------------------------


// ----------------------------------
// Checker
// ----------------------------------

// ----------------------------------


module.exports = { init, event_create }
