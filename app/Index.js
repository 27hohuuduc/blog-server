const express = require("express")
const { MongoClient, ServerApiVersion } = require("mongodb")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const dir = require("../root").dir
const env = require("./Environment")
const api = require("./Routers/Api")

class Index {

    static instance

    constructor(process) {
        Index.instance = this
        this.port = process.env.PORT || 5000
        this.client = new MongoClient(env.Mongodb.Url, {
            tlsCertificateKeyFile: dir + "/etc/secrets/cert.pem",
            serverApi: ServerApiVersion.v1
        })
        this.client.connect()
        const database = this.client.db(env.Mongodb.Database)
        this.dUsers = database.collection("User")
        this.dContents = database.collection("Contents")
        this.run().then(e => console.log("Connected MongoDB")).catch(console.dir)
    }

    async run() {

        //Middleware
        if (process.env.PORT)
            app.use(cors({
                origin: Index.Setting.Origin
            }))
        else
            app.use(cors({
                origin: "*"
            }))

        app.use(bodyParser.urlencoded({
            extended: true
        }))

        app.use(bodyParser.json())

        app.use("/", (req, res, next) => {
            next()
        })

        //Router
        app.use("/api", api)

        app.use((req, res, next) => {
            res.send('<html><body>Visit at <a href="https://27hohuuduc.github.io">DucHoBlog</a></body></html>')
        })

        app.use((err, req, res, next) => {
            console.log(err)
            switch (err.message) {
                case "Unauthorized":
                    res.status(401).send("Authentication failed")
                    break
                default:
                    res.status(500).send("Something failed!")
            }
            return
        })

        //Start
        const server = app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`))

        server.keepAliveTimeout = 2 * 1000
        server.headersTimeout = 5000
        server.timeout = 2 * 1000
        server.requestTimeout = 10000
        server.setTimeout(30000)
    }
}

module.exports = Index