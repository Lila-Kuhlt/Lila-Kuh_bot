module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Poll', {
        poll_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        guild_id: Sequelize.STRING,
        channel_id: Sequelize.STRING,
        private: Sequelize.BOOLEAN
    }, {
        timestamp: false
    })
}