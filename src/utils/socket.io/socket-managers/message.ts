import { User } from "../../store/User";
import { ExtendedIO, ExtendedSocket } from "../io";

export const registerMessageManager = (socket: ExtendedSocket, io: ExtendedIO) => {
  socket.on("emit_to_room", async (message) => {
    try {
      const sender = await User.get(socket.handshake.auth.user_id);
      const roomId = sender!.roomId;
      io.to(roomId).emit("publish_message", message, sender!.alias);
    } catch (error: any) {
      socket.emit("ERROR", error.message);
    }
  });
};
