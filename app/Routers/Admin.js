const express = require("express")
const jwt = require("jsonwebtoken")
const env = require("../Environment")
const validFiles = require("../ValidFiles")
const github = require("../GitHubApi")()
const multer = require('multer')
const { UnauthorizedError, InvalidFileTypeError, InvalidJSONError } = require("../SelfDefinedError")
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2097152 },
    fileFilter: (req, file, cb) => {
        const type = validFiles.find((x) => x.mimetype === file.mimetype)
        if (type) {
            file.storagetype = type.storagetype
            cb(null, true)
        }
        else
            cb(new InvalidFileTypeError(), false)
    }
})

let admin = express.Router()
//Verification
admin.use(async (req, res, next) => {
    try {
        const auth = req.headers.authorization
        if (!auth.includes("Bearer "))
            next(new UnauthorizedError())

        const token = jwt.verify(auth.split(" ")[1], env.SecretKey)
        if (token.iat < (await require("../Index").instance.dUsers.findOne({ role: token.role })).valid_date)
            next(new UnauthorizedError())
        req.token = token
        next()
    }
    catch (e) {
        next(new UnauthorizedError())
    }
})

admin.get("/logout", (req, res) => {
    require("../Index").instance.dUsers.updateOne({ role: req.token.role }, { $set: { valid_date: Date.now() } })
    res.send("ok")
})

admin.post("/content", upload.fields([{ name: 'file', maxCount: 20 }, { name: "text", maxCount: 1 }, { name: "topic", maxCount: 1 }]), (req, res, next) => {

    const text = req.body.text
    if (!text || text.length == 0 || text.trim().length == 0) {
        res.status(400).send("Content can not be empty.")
        return
    }

    try {
        const topic = JSON.parse(req.body.topic)
    } catch (err) {
        if (err instanceof SyntaxError)
            next(new InvalidJSONError())
        else
            next(err)
        return
    }

    req.files["file"].forEach(f => {
        github.upload(Date.now().toString() + f.storagetype, Buffer.from(f.buffer), (x) => {
            console.log(x)
        })
    })

    res.send("ok")

})

admin.get("/test", (req, res) => {
    res.send("ok")
})

module.exports = admin