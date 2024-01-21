"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import env from "./Environment"
// console.log(env.variables, env.cert)
const fs_1 = __importDefault(require("fs"));
const path = __dirname.slice(0, -4);
fs_1.default.readdirSync(path).forEach(e => {
    console.log(e);
    if (!e.includes(".")) {
        fs_1.default.readdirSync(path + "/" + e).forEach(i => {
            console.log(i);
        });
    }
});
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
StartUp.PORT = process.env.PORT || 5000;
