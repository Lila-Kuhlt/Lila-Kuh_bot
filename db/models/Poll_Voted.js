module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Poll_Voted', {
        poll_id: {
            type: Sequelize.STRING,
            unique: true
        },
        user_id: {
            type: Sequelize.STRING,
            unique: true
        },
        choices: Sequelize.STRING,
    }, {
        timestamp: false
    })
}