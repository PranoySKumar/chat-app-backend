import { User } from "../../store/User";
import { ExtendedIO, ExtendedSocket } from "../io";

export const registerRoomManager = (socket: ExtendedSocket, io: ExtendedIO) => {
  socket.on("join_room", async () => {
    try {
      const { room_id, user_id } = socket.handshake.auth;
      socket.join(room_id);

      const user = User.get(user_id);
      io.to(room_id).emit("user_joined", user!.alias, user_id);
    } catch (error: any) {
      socket.emit("ERROR", error.message);
    }
  });
};
