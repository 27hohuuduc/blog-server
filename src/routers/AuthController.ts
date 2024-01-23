import { NextFunction, Request, Response, Router } from "express"
import { InvalidFileTypeError, InvalidJSONError, UnauthorizedError } from "../modules/SelfDefinedError"
import BaseController from "./BaseController"
import ValidFiles from "../modules/ValidFiles"
import jwt from "jsonwebtoken"
import multer from "multer"
import GithubContext from "../modules/GitHubContext"
import Singleton from "../Singleton"

interface SelfPayload {
    role: string,
    iat: number
}

interface SelfRequest extends Request {
    token: SelfPayload
}

interface SelfFile extends Express.Multer.File {
    storagetype: string
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2097152 },
    fileFilter: (req, file: SelfFile, cb) => {
        const type = ValidFiles.find((x) => x.mimetype === file.mimetype)
        if (type) {
            file.storagetype = type.storagetype
            cb(null, true)
        }
        else {
            cb(new InvalidFileTypeError())
        }
    }
})

export default class AuthController extends BaseController {
    constructor(private github: GithubContext = Singleton.getInstance(GithubContext)) {

        super()

        this.router = Router().use("/auth")

        //Verification
        this.router.use(this.verifyHandle)

        this.router.get("/logout", this.logoutHandle)

        this.router.post("/content",
            upload.fields([{ name: 'file', maxCount: 20 }, { name: "text", maxCount: 1 }, { name: "topic", maxCount: 1 }]),
        )

        this.router.get("/test", (req, res) => {
            res.send("ok")
        })

    }

    verifyHandle() {
        async (req: SelfRequest, res: Response, next: NextFunction) => {
            try {
                const auth = req.headers.authorization
                if (!auth.includes("Bearer "))
                    next(new UnauthorizedError())

                const token = jwt.verify(auth.split(" ")[1], this.env.SecretKey) as SelfPayload
                if (token.iat < (await this.db.users.findOne({ role: token.role })).valid_date)
                    next(new UnauthorizedError())
                req.token = token
                next()
            }
            catch (e) {
                next(new UnauthorizedError())
            }
        }
    }

    logoutHandle(req: SelfRequest, res: Response) {
        this.db.users.updateOne({ role: req.token.role }, { $set: { valid_date: Date.now() } })
        res.send("ok")
    }

    uploadHandle(req: Request, res: Response, next: NextFunction) {

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

        req.files["file"].forEach((f: SelfFile) => {
            this.github.upload(Date.now().toString() + f.storagetype, Buffer.from(f.buffer), (x) => {
                console.log(x)
            })
        })

        res.send("ok")

    }

}