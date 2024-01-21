const fs = require('fs')

__dirname = __dirname.slice(0, -4)

console.log(__dirname)

console.log(fs.readdirSync(__dirname))

console.log(fs.readdirSync(__dirname + "/etc/secrets/"))

console.log(fs.readFileSync(__dirname + "/etc/secrets/config.json"))
