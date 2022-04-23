import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Handshake } from "socket.io/dist/socket";
import { registerMessageManager } from "./socket-managers/message";
import { registerRoomManager } from "./socket-managers/room";
import { Room } from "../../models/Room";
import { User } from "../store/User";

export interface ServerToClientEvents {
  publish_message: (message: string, senderAlias: string) => void;
  user_joined: (alias: string, user_id: string) => void;
  user_left: (user_id: string, alias: string) => void;
  ERROR: (message: string) => void;
}
export interface ClientToServerEvents {
  emit_to_room: (message: string) => void;
  join_room: () => void;
}
export interface InterServerEvents {
  ping: () => void;
}
export interface SocketData {}

export interface ExtendedSocket
  extends Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
  handshake: Handshake & {
    auth: {
      user_id: string;
      room_id: string;
    };
  };
}
export interface ExtendedIO
  extends Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {}

let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function getIO() {
  return io;
}
export function InitaliseIO(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: [process.env.CLIENT || "", "http://localhost:3000"],
      methods: ["POST", "GET"],
      credentials: true,
    },
  });
  io.use((socket: ExtendedSocket | Socket, next) => {
    if (socket.handshake.auth.room_id && socket.handshake.auth.user_id) {
      next();
    } else {
      next(new Error("something went wrong"));
    }
  });
  //ON_CONNECTION
  io.on("connection", (socket) => {
    console.log("a user just connected =>" + socket.id);
    registerOnDisconnectManager(socket as ExtendedSocket, io);
    registerMessageManager(socket as ExtendedSocket, io);
    registerRoomManager(socket as ExtendedSocket, io);
  });
}

const registerOnDisconnectManager = (socket: ExtendedSocket, io: ExtendedIO) => {
  socket.on("disconnect", async () => {
    try {
      console.log("disconnected  ", socket.id);
      const { room_id, user_id } = socket.handshake.auth;
      //get the user
      const user = await User.get(user_id);
      //emit the user_left and delete the user from store
      io.to(room_id).emit("user_left", user_id, user?.alias!);
      User.delete(user_id);
      //finds the room checks how many participants are remaining and deletes the
      //room
      const room = await Room.findById(room_id);
      const users = room?.participants.filter((participant_id) => user_id !== participant_id);
      if (users!.length > 0) {
        return;
      }
      room?.delete();
    } catch (error: any) {
      socket.emit("ERROR", error.message);
    }
  });
};
