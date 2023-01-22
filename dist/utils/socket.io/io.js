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
exports.InitaliseIO = exports.getIO = void 0;
const socket_io_1 = require("socket.io");
const message_1 = require("./socket-managers/message");
const room_1 = require("./socket-managers/room");
const Room_1 = require("../../models/Room");
const User_1 = require("../store/User");
let io;
function getIO() {
    return io;
}
exports.getIO = getIO;
function InitaliseIO(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: [process.env.CLIENT || "", "http://localhost:3000"],
            methods: ["POST", "GET"],
            credentials: true,
        },
    });
    io.use((socket, next) => {
        if (socket.handshake.auth.room_id && socket.handshake.auth.user_id) {
            next();
        }
        else {
            next(new Error("something went wrong"));
        }
    });
    //ON_CONNECTION
    io.on("connection", (socket) => {
        console.log("a user just connected =>" + socket.id);
        registerOnDisconnectManager(socket, io);
        (0, message_1.registerMessageManager)(socket, io);
        (0, room_1.registerRoomManager)(socket, io);
    });
}
exports.InitaliseIO = InitaliseIO;
const registerOnDisconnectManager = (socket, io) => {
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("disconnected  ", socket.id);
            const { room_id, user_id } = socket.handshake.auth;
            //get the user
            const user = User_1.User.get(user_id);
            //emit the user_left and delete the user from store
            io.to(room_id).emit("user_left", user_id, user === null || user === void 0 ? void 0 : user.alias);
            User_1.User.delete(user_id);
            //finds the room checks how many participants are remaining and deletes the
            //room
            const room = io.sockets.adapter.rooms.get(room_id);
            if (!room) {
                yield Room_1.Room.findByIdAndDelete(room_id);
            }
            console.log("roomId", room_id);
            yield Room_1.Room.findByIdAndDelete(room_id);
        }
        catch (error) {
            socket.emit("ERROR", error.message);
        }
    }));
};
