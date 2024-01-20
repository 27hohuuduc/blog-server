"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("./Environment"));
console.log(Environment_1.default.variables, Environment_1.default.cert);
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
