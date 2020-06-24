import Game from "./game";
import RoomData from "../interfaces/roomData";
import ApiRequest from "../helperClasses/apiRequest";
import { GameData } from "../interfaces/gameData";
import ChallengeData from "../interfaces/challengeData";
import ChallengeComplete from "../interfaces/challengeComplete";

export default class UnitySocketListener {
    socket : SocketIO.Socket
    roomData : RoomData
    gameData : GameData
    gameInstance : Game
    apiRequest : ApiRequest
    constructor(_socket : SocketIO.Socket, _roomData : RoomData, _gameData : GameData){
        this.socket = _socket
        this.gameInstance = Game.getGameInstance()
        this.apiRequest = ApiRequest.getApiRequestInstance(); 
        this.roomData = _roomData;
        this.gameData = _gameData
        
        //if thee are no avalible react clients
        if(!_roomData.userId){
            console.log("in if no id if")
            this.socket.emit("sendToErrorPage",{})
        } else {
            console.log("in else")
            this.gameInstance.addUnitySocketToGameConnection(_roomData, this.socket);
            this.socket.join(this.roomData.gameName + "/" + this.roomData.userId)
            //tells only react
            this.socket.to(this.roomData.gameName + "/" + this.roomData.userId).emit("gameReady")
            console.log("gameData: ", this.gameData)
            this.socket.emit("reciveGameData", this.gameData)
            //send game info to unity client
            
    
            this.socket.on("challengeCompleted", async (challengeData : ChallengeData) =>{
                try{
                    const challengeComplete : ChallengeComplete = {
                        userId : this.roomData.userId,
                        challenge : challengeData
                    }
                    const res = await this.apiRequest.post("challenge","challengeCompleted", challengeComplete)
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
