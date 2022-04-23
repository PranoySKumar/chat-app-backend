import { NextFunction, Request, Response, RequestHandler } from "express";
import short from "short-uuid";
import { Room } from "../models/Room";
import { getIO } from "../utils/socket.io/io";
import { User } from "../utils/store/User";

interface QueryParams {
  alias: string;
}

export const createRoom = async (req: Request<null, null, null, QueryParams>, res: Response, next: NextFunction) => {
  const { alias } = req.query;
  const user_id = short.generate();

  try {
    //saving room
    const room = new Room();
    room.participants.push(user_id);
    const _doc = await room.save();
    //creating user
    const newUser = new User(alias, _doc.id);
    newUser.save(user_id);
    // //joining the room
    // getIO().in(sid).socketsJoin(_doc.id);

    res.status(200).json({ user_id, room_id: _doc.id });
  } catch (error) {
    next(error);
  }
};

interface JoinRoomParams {
  room_id: string;
}

export const joinRoom: RequestHandler<JoinRoomParams, any, any, QueryParams> = async (req, res, next) => {
  const { room_id } = req.params;
  const { alias } = req.query;
  //checking the validity of the room;
  if (!getIO().sockets.adapter.rooms.has(room_id)) {
    res.status(400).json({ error: "this room does not exist" });
    return;
  }
  try {
    const user_id = short.generate();
    //creating useer
    new User(alias, room_id).save(user_id);
    //updating participants
    await Room.findByIdAndUpdate(room_id, { $push: { participants: user_id } });
    // getIO().sockets.sockets.get(sid)?.join(room_id);
    // getIO().to(room_id).emit("user_joined", alias, user_id);
    res.status(200).json({ user_id, room_id });
  } catch (error) {
    next(error);
  }
};
