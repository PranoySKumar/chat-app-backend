import { model, Schema } from "mongoose";

interface RoomSchema {
  participants: string[];
}
const roomSchema = new Schema<RoomSchema>({
  participants: {
    type: [String],
    default: [],
  },
});

export const Room = model<RoomSchema>("Room", roomSchema);
