import { Collection, MongoClient, ServerApiVersion } from "mongodb"
import Environment from "../Environment"
import Singleton from "../Singleton"

export default class MongoDBContext {

    users: Collection
    contents: Collection

    constructor() {
        const env = Singleton.getInstance(Environment)
        const client = new MongoClient(env.variables.Mongodb.url, {
            tlsCertificateKeyFile: env.root + "cert.pem",
            serverApi: ServerApiVersion.v1
        })
        client.connect()
        const database = client.db(env.variables.Mongodb.database)
        this.users = database.collection("User")
        this.contents = database.collection("Contents")
    }
}