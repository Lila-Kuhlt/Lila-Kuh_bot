module.exports = {
    name: 'poll_edit',
    description: '',
    aliases: ['pe', 'polle', 'polledit'],
    args_needed: true,
    args_min_length: 2,
    usage: '[poll_msg_id] [question] [option1] [option2] ...',
    need_permission: ['MANAGE_MESSAGES', 'ADD_REACTIONS', 'SEND_MESSAGES'],
    disabled: false,
    enable_slash: true,
    async execute(msg, args) {

    },
};