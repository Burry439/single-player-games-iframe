import RoomData  from "./roomData";

export interface GameConnection {
    roomData : RoomData
    unitySocket : SocketIO.Socket,
    reactSocket : SocketIO.Socket
}