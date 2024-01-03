
const { MongoClient, ServerApiVersion } = require("mongodb")
const { OAuth2Client } = require("google-auth-library")
const fs = require("fs")
const cors = require("cors")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const express = require("express")
const app = express()
const dir = require("../root").dir

class Index {

    static Setting = JSON.parse(fs.readFileSync(dir + "/etc/secrets/config.json"))
    static unauthorized = res => res.status(401).send("Authentication failed")

    constructor(process) {
        this.port = process.env.PORT || 5000
        this.client = new MongoClient(Index.Setting.Mongodb.Url, {
            tlsCertificateKeyFile: dir + "/etc/secrets/cert.pem",
            serverApi: ServerApiVersion.v1
        })
        this.client.connect()
        const database = this.client.db(Index.Setting.Mongodb.Database)
        this.dUsers = database.collection("User")
        this.run().then(e => console.log("Connected MongoDB.")).catch(console.dir)
    }

    async run() {
        const oAuth2Client = new OAuth2Client()

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
        let api = express.Router()
        app.use("/api", api)

        api.post("/debug", (req, res) => {
            res.json(req.body)
        })

        //Auth
        api.post("/basic", async (req, res) => {
            this.verify(res, { pass: req.body.password })
        })

        api.post("/google", async (req, res) => {
            try {
                const ticket = await oAuth2Client.verifyIdToken({
                    idToken: req.body.token
                })

                this.verify(res, { google: ticket.getUserId() })
            }
            catch {
                Index.unauthorized(res)
                return
            }
        })

        //Protected
        let admin = express.Router()
        api.use("/admin", admin)
        admin.use((req, res, next) => {
            try {
                const auth = req.headers.authorization
                if (!auth.includes("Bearer ")) {
                    Index.unauthorized(res)
                    return
                }
                const token = auth.split(" ")[1]
                req.token = jwt.verify(token, Index.Setting.SecretKey)
                next()
            }
            catch (e) {
                Index.unauthorized(res)
                return
            }
        })

        admin.get("/test", (req, res) => {
            res.json({ role: req.token.role })
        })

        //NotFound
        api.use((req, res, next) => {
            res.status(404).send('Not Found')
        })

        app.use((req, res, next) => {
            res.send('<html><body>Visit at <a href="https://27hohuuduc.github.io">DucHoBlog</a></body></html>')
        })

        //Start
        const server = app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`))

        server.keepAliveTimeout = 2 * 1000
        server.headersTimeout = 5000
        server.timeout = 2 * 1000
        server.requestTimeout = 10000
        server.setTimeout(30000)
    }

    async verify(res, query) {
        const user = await this.dUsers.findOne(query)
        if (user) {
            const token = jwt.sign({
                role: user.role
            }, Index.Setting.SecretKey, {
                expiresIn: Index.Setting.Expires
            })

            res.json({ token })
        }
        else {
            res.status(401).send("Invalid Password")
        }
    }
}

module.exports = Index