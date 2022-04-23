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
exports.fetchUsers = void 0;
const Room_1 = require("../models/Room");
const User_1 = require("../utils/store/User");
const fetchUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const room_id = req.params.room_id;
    const membersAliases = [];
    try {
        const result = yield Room_1.Room.findById(room_id, { participants: 1, _id: 0 });
        if (!result) {
            return;
        }
        //updates the array and fills it with aliases
        for (let i = 0; i < (result === null || result === void 0 ? void 0 : result.participants.length); i++) {
            const participant = result === null || result === void 0 ? void 0 : result.participants[i];
            const user = yield User_1.User.get(participant);
            user && membersAliases.push({ user_id: user.user_id, alias: user.alias });
        }
        res.json({ participants: membersAliases });
    }
    catch (error) {
        next(error);
    }
});
exports.fetchUsers = fetchUsers;
