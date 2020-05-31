import RoomData  from "./roomData";

export interface gameConnection {
    roomData : RoomData
    unitySocket : SocketIO.Socket,
    reactSocket : SocketIO.Socket
}