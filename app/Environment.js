const fs = require('fs')
const dir = require("../root").dir

const Environment = JSON.parse(fs.readFileSync(dir + "/etc/secrets/config.json"))

module.exports = Environment