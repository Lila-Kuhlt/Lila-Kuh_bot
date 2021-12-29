module.exports = (sequelize, Sequelize) => {
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