const express = require("express")

const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const dir = require("../root").dir
const env = require("./Environment")
const api = require("./Routers/Api")
const { UnauthorizedError, InvalidFileTypeError, InvalidJSONError } = require("./SelfDefinedError")

class Index {

    static instance

    constructor(process) {
        this.port = process.env.PORT || 5000

        this.client.connect()
        const database = this.client.db(env.Mongodb.Database)
        this.dUsers = database.collection("User")
        this.dContents = database.collection("Contents")
        this.run().then(e => console.log("Connected MongoDB")).catch(console.dir)        
    }

    async run() {

        //Middleware
        app.use(cors({
            origin: env.Origin
        }))

        app.use(bodyParser.json())

        //Router
        app.use("/api", api)

        app.use((req, res, next) => {
            res.redirect("https://27hohuuduc.github.io")
        })

        app.use((err, req, res, next) => {
            console.log(err)
            switch (true) {
                case err instanceof UnauthorizedError:
                    res.status(401).send("Authentication failed")
                    break
                case err instanceof InvalidFileTypeError:
                    res.status(400).send("Invalid file type.")
                    break
                case err instanceof InvalidJSONError:
                    res.status(400).send("Invalid JSON string.")
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