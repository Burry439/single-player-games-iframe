import Game from "./game";
import RoomData from "../interfaces/roomData";

export default class ReactSocketListener {
    socket : SocketIO.Socket
    roomData : RoomData
    gameInstance : Game
    userId : string = "0"

    constructor(_socket : SocketIO.Socket, _roomData : RoomData){
        this.socket = _socket
        this.roomData = _roomData
        this.gameInstance = Game.getGameInstance()

        if(!this.gameInstance.isDuplicate(this.roomData.userId)){
            console.log(this.roomData.gameName + "/" + this.roomData.userId)
            this.socket.join(this.roomData.gameName + "/" + this.roomData.userId)
            this.gameInstance.addGameConnection({
                roomData : {
                    userId : this.roomData.userId ,
                    gameName : this.roomData.gameName,
                },
                reactSocket : this.socket,
                unitySocket : null
            })
            this.userId = this.roomData.userId;
            this.socket.emit("gameReady")
        } else {
            this.socket.emit('isDuplicate')
        }

 

        this.socket.on("disconnect",() =>{
            this.gameInstance.removeGameConnection(this.userId)
        })
    }
}
