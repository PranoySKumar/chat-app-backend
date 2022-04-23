"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMessageManager = void 0;
const User_1 = require("../../store/User");
const registerMessageManager = (socket, io) => {
    socket.on("emit_to_room", (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sender = yield User_1.User.get(socket.handshake.auth.user_id);
            const roomId = sender.roomId;
            io.to(roomId).emit("publish_message", message, sender.alias);
        }
        catch (error) {
            socket.emit("ERROR", error.message);
        }
    }));
};
exports.registerMessageManager = registerMessageManager;
