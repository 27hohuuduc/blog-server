const express = require("express")
const jwt = require("jsonwebtoken")
const env = require("../Environment")
const github = require("../GitHubApi")()

let admin = express.Router()
//Verification
admin.use((req, res, next) => {
    try {
        const auth = req.headers.authorization
        if (!auth.includes("Bearer ")) {
            next(new Error("Unauthorized"))
        }
        const token = auth.split(" ")[1]
        req.token = jwt.verify(token, env.SecretKey)
        next()
    }
    catch (e) {
        next(new Error("Unauthorized"))
    }
})

admin.post("/content", (req, res) => {
    console.log(req.headers)

// const s = 'Heello'
// github.upload('test.txt', Buffer.from(s), (x) => {
    
// })
    res.send("ok")
})

admin.get("/test", (req, res) => {
    res.json({ role: req.token.role })
})

module.exports = admin