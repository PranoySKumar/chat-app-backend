import { Router } from "express";
import { fetchUsers } from "../controllers/DataQuery";

const routes = Router();
routes.get("/fetch-users/:room_id", fetchUsers);

export default routes;
