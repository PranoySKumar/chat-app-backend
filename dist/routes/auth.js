"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const routes = (0, express_1.Router)();
routes.get("/create-room", auth_1.createRoom);
routes.get("/join-room/:room_id", auth_1.joinRoom);
exports.default = routes;
