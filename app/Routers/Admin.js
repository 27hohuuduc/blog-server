const express = require("express")
const jwt = require("jsonwebtoken")

let admin = express.Router()
//Verification
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

// admin.post("/upload", (req, res) => {
//     console.log()
// const GithubApi = require('./app/GitHub')
// const github = new GithubApi()

// const s = 'Heello'
// github.upload('test.txt', Buffer.from(s), (x) => {
    
// })
// })

admin.get("/test", (req, res) => {
    res.json({ role: req.token.role })
})

module.exports = admin