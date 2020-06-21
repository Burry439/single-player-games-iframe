import Game from "./game";
import RoomData from "../interfaces/roomData";
import ApiRequest from "../helperClasses/apiRequest";
import { GameData } from "../interfaces/gameData";
import ChallengeData from "../interfaces/challengeData";
export default class UnitySocketListener {
    socket : SocketIO.Socket
    roomData : RoomData
    gameInstance : Game
    apiRequest : ApiRequest
    constructor(_socket : SocketIO.Socket, _roomData : RoomData){
        this.socket = _socket
        this.gameInstance = Game.getGameInstance()
        this.apiRequest = ApiRequest.getApiRequestInstance(); 
        this.roomData = _roomData;
        // add this game instance and get the user Id for the room name
        
        console.log(_roomData)
        //if thee are no avalible react clients
        if(!_roomData.userId){
            console.log("in if no id if")
            this.socket.emit("sendToErrorPage",{})
        } else {
            console.log("in else")
            this.gameInstance.addUnitySocketToGameConnection(_roomData, this.socket);
            this.socket.join(this.roomData.gameName + "/" + this.roomData.userId)

            //send game info to unity client
            //this.socket.emit("connectedToServer",this.gameData)
    
            this.socket.on("challengeCompleted", async (challengeData : ChallengeData) =>{
                try{
                    const res = await this.apiRequest.post("challenge","challengeCompleted", challengeData)
                    if(res.data){
                        //send to react
                        this.socket.to(this.roomData.gameName + "/" + this.roomData.userId).emit("challengeCompleted", res.data)
                    }else{
                        console.log("challenge already completed")
                    }
                    
                }catch(e){
                    console.log(e)
                }
            })
        }
    }
}
