import { Router } from "express";
import { createRoom, joinRoom } from "../controllers/auth";

const routes = Router();
routes.get("/create-room", createRoom);
routes.get("/join-room/:room_id", joinRoom);

export default routes;
