module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Mensa', {
        guild_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        channel_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        enabled: Sequelize.BOOLEAN
    }, {
        timestamp: false
    })
}