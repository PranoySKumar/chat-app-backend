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
exports.registerRoomManager = void 0;
const User_1 = require("../../store/User");
const registerRoomManager = (socket, io) => {
    socket.on("join_room", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { room_id, user_id } = socket.handshake.auth;
            socket.join(room_id);
            const user = User_1.User.get(user_id);
            io.to(room_id).emit("user_joined", user.alias, user_id);
        }
        catch (error) {
            socket.emit("ERROR", error.message);
        }
    }));
};
exports.registerRoomManager = registerRoomManager;
