import express, { Express } from "express";
import Environment from "./Environment"
import Singleton from "./Singleton";
import MongoDBContext from "./module/MongoDBContext";

Singleton.getInstance(Environment).variables

Singleton.getInstance(MongoDBContext)

// const app: Express = express();


// const server = app.listen(process.env.PORT || 3000, () => {
//     console.log("Runnning")
// })

class StartUp {

    constructor() {

    }

    run() {

    }
}