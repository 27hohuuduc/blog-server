"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path = __dirname + "/etc/secrets/";
const config = fs_1.default.readFileSync(path + "config.json", "utf8");
const cert = fs_1.default.readFileSync(path + "cert.pem", "utf8");
exports.default = { variables: JSON.parse(config), cert: cert };
