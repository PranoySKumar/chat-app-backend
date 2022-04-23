"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DataQuery_1 = require("../controllers/DataQuery");
const routes = (0, express_1.Router)();
routes.get("/fetch-users/:room_id", DataQuery_1.fetchUsers);
exports.default = routes;
