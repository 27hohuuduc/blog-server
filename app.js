console.log(__dirname)

console.log(fs.readdirSync(__dirname + "etc/secrets/"))

console.log(fs.readFileSync(__dirname + "etc/secrets/config.json"))
