module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Guild', {
        poll_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        msg: Sequelize.TEXT,
    }, {
        timestamp: false
    })
}