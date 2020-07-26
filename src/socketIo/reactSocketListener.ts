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
        console.log(this.socket.rooms)
        if(!this.gameInstance.isDuplicate(this.roomData)){
            console.log("not duplicate")
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
        } else {
            this.socket.emit('isDuplicate')
            this.socket.disconnect()
        }

 

        this.socket.on("disconnect",() =>{
            console.log("disconnect in react")
            this.gameInstance.removeGameConnection(this.roomData)
        })
    }
}
