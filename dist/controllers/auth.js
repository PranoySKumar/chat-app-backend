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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinRoom = exports.createRoom = void 0;
const short_uuid_1 = __importDefault(require("short-uuid"));
const Room_1 = require("../models/Room");
const io_1 = require("../utils/socket.io/io");
const User_1 = require("../utils/store/User");
const createRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { alias } = req.query;
    const user_id = short_uuid_1.default.generate();
    try {
        //saving room
        const room = new Room_1.Room();
        room.participants.push(user_id);
        const _doc = yield room.save();
        //creating user
        const newUser = new User_1.User(alias, _doc.id);
        newUser.save(user_id);
        // //joining the room
        // getIO().in(sid).socketsJoin(_doc.id);
        res.status(200).json({ user_id, room_id: _doc.id });
    }
    catch (error) {
        next(error);
    }
});
exports.createRoom = createRoom;
const joinRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { room_id } = req.params;
    const { alias } = req.query;
    //checking the validity of the room;
    if (!(0, io_1.getIO)().sockets.adapter.rooms.has(room_id)) {
        res.status(400).json({ error: "this room does not exist" });
        return;
    }
    try {
        const user_id = short_uuid_1.default.generate();
        //creating useer
        new User_1.User(alias, room_id).save(user_id);
        //updating participants
        yield Room_1.Room.findByIdAndUpdate(room_id, { $push: { participants: user_id } });
        // getIO().sockets.sockets.get(sid)?.join(room_id);
        // getIO().to(room_id).emit("user_joined", alias, user_id);
        res.status(200).json({ user_id, room_id });
    }
    catch (error) {
        next(error);
    }
});
exports.joinRoom = joinRoom;
