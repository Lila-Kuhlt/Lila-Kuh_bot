// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-slash-command
const format = require("../../../../config/config.json").date.format

module.exports = [
    {
        "name": "date",
        "description": "Date in format " + format,
        "required": true,
        "choices": []
    }
]
