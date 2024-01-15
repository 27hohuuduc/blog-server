const express = require("express")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const oAuth2Client = new OAuth2Client()
const Index = require("../Index")
const env = require("../Environment")
const admin = require("./Admin")
const { UnauthorizedError } = require("../SelfDefinedError")

const verify = async (res, query) => {
    const user = await require("../Index").instance.dUsers.findOne(query)
    if (user) {
        const token = jwt.sign({
            role: user.role,
            iat: Date.now()
        }, env.SecretKey, {
            expiresIn: env.Expires
        })

        res.json({ token })
    }
    else {
        res.status(401).send("Invalid Password")
    }
}

const api = express.Router()

api.post("/debug", (req, res) => {
    res.json(req.body)
})

api.get("/debug", (req, res) => {
    res.json({ msg: "test" })
})

//Auth
api.post("/basic", async (req, res) => {
    verify(res, { pass: req.body.password })
})

api.post("/google", async (req, res, next) => {
    try {
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: req.body.token
        })

        this.verify(res, { google: ticket.getUserId() })
    } catch {
        next(new UnauthorizedError())
    }
})

api.use("/admin", admin)

//NotFound
api.use((req, res, next) => {
    res.status(404).send('Not Found')
})

module.exports = api