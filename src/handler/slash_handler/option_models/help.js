module.exports = [
    {
        "name": "command",
        "description": "information for the specific command",
        "required": false,
        "choices": [
            { "name": "help", "value": "help" },
            { "name": "lang", "value": "lang" },
            { "name": "echo", "value": "echo" },
            { "name": "ping", "value": "ping" },
            { "name": "poll", "value": "poll" },
            { "name": "poll_private", "value": "poll_private" },
        ]
    }
]
