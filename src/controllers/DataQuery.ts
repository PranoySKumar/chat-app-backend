import { json, RequestHandler } from "express";
import { Room } from "../models/Room";
import { User } from "../utils/store/User";

interface fetchUsersParams {
  room_id: string;
}
export const fetchUsers: RequestHandler<fetchUsersParams, any, any, any> = async (req, res, next) => {
  const room_id = req.params.room_id;
  const membersAliases: { user_id: string; alias: string }[] = [];
  try {
    const result = await Room.findById(room_id, { participants: 1, _id: 0 });

    if (!result) {
      return;
    }

    //updates the array and fills it with aliases
    for (let i = 0; i < result?.participants.length; i++) {
      const participant = result?.participants[i];
      const user = await User.get(participant);
      user && membersAliases.push({ user_id: user.user_id!, alias: user.alias });
    }
    res.json({ participants: membersAliases });
  } catch (error) {
    next(error);
  }
};
