import Game from "./game";
import RoomData from "../interfaces/roomData";
import ApiRequest from "../helperClasses/apiRequest";
import { GameData } from "../interfaces/gameData";
export default class UnitySocketListener {
    socket : SocketIO.Socket
    gameData : GameData
    gameInstance : Game
    apiRequest : ApiRequest
    constructor(_socket : SocketIO.Socket, _gameData : any, _userId : string){
        this.socket = _socket
        this.gameInstance = Game.getGameInstance()
        this.apiRequest = ApiRequest.getApiRequestInstance(); 
        // add this game instance and get the user Id for the room name
        
        console.log(_userId)
        //if thee are no avalible react clients
        if(!_userId){
            console.log("in if no id if")
            this.socket.emit("sendToErrorPage",{})
        } else {
            console.log("in else")
            this.gameInstance.addUnitySocketToGameConnection(_gameData, this.socket);
            this.gameData = {
                id:  _gameData._id,
                name: _gameData.name,              
                userId:  _userId
            }

            this.socket.join(this.gameData.name + "/" + this.gameData.userId)
            console.log("game data: ",this.gameData)
            //send game info to unity client
            this.socket.emit("connectedToServer",this.gameData)
    
            this.socket.on("challengeCompleted", async (challenge : any) =>{
                try{
                    
                    const res = await this.apiRequest.post("game","challengeCompleted", challenge)
                    console.log(res.data)
                    if(res.data){
                        console.log(this.gameData.name + "/" + this.gameData.userId)
                        //send to react
                        this.socket.to(this.gameData.name + "/" + this.gameData.userId).emit("challengeCompleted", res.data)
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
