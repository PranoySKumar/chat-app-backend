"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const io_1 = require("./utils/socket.io/io");
const app = (0, express_1.default)();
//config dotenv
dotenv_1.default.config();
app.use((0, helmet_1.default)());
//middleware setup
app.use((0, cors_1.default)({
    origin: process.env.CLIENT || "http://localhost:3000",
}));
app.use(express_1.default.json());
//ERROR HNADLING
app.use(((error, req, res, next) => {
    console.log("Error occured");
    res.json({ error: true, message: error.message });
}));
console.log(process.env);
//route handling
const auth_1 = __importDefault(require("./routes/auth"));
const dataQuery_1 = __importDefault(require("./routes/dataQuery"));
app.use("/auth", auth_1.default);
app.use("/data", dataQuery_1.default);
//mongoose intialisation
console.log(process.env.MONGODB);
mongoose_1.default
    .connect(process.env.MONGODB || "mongodb://127.0.0.1:27017/TeaTime")
    .then(() => {
    console.log("mongoose connected");
})
    .catch((error) => console.log(error));
//listening
const server = app.listen(parseInt((_a = process.env) === null || _a === void 0 ? void 0 : _a.PORT, 10) || 4000);
(0, io_1.InitaliseIO)(server);
