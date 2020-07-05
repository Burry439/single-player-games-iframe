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
        if(!_roomData.userId){
            this.socket.emit("sendToErrorPage",{})
        } else {
            console.log("in else")
            this.gameInstance.addUnitySocketToGameConnection(_roomData, this.socket);
            this.socket.join(this.roomData.gameName + "/" + this.roomData.userId)
            this.socket.to(this.roomData.gameName + "/" + this.roomData.userId).emit("gameReady")
            this.socket.emit("reciveGameData", this.gameData)

            this.socket.on("challengeCompleted", async (challengeData : ChallengeData) =>{
            try{
                console.log("challengeCompleted")
                const challengeComplete : ChallengeComplete = {
                    userId : this.roomData.userId,
                    challenge : challengeData
                }
                const res = await this.apiRequest.post("challenge","challengeCompleted", challengeComplete)
                if(res.data){
                    //send to react
                    this.socket.to(this.roomData.gameName + "/" + this.roomData.userId).emit("challengeCompleted", res.data)
                }
            }catch(e){
                console.log(e)
            }
            })
        }
    }
}
