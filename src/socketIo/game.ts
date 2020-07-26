
import { GameConnection } from "../interfaces/gameConnection";
import RoomData from "../interfaces/roomData";

export default class Game {

    private static GameInstance : Game;
   // private playerId : String;
    private gameConnections : GameConnection[]
    private constructor(){
        this.gameConnections = []
    }

    public getGameConnection(roomData : RoomData) : GameConnection {
        let _gameConnection : GameConnection
        this.gameConnections.forEach((gameConnection) =>{
            if(gameConnection.roomData.gameName == roomData.gameName && gameConnection.roomData.userId == roomData.userId){
                _gameConnection = gameConnection
            }
        })
        return _gameConnection
    }

    public checkReactConnectionExists(roomData : RoomData){
        let exists : Boolean = false
        this.gameConnections.forEach((gameConnection) =>{
            if(gameConnection.roomData.gameName == roomData.gameName && gameConnection.roomData.userId == roomData.userId && gameConnection.reactSocket !== null && gameConnection.unitySocket == null){
                exists = true
            }
        })
        return exists
    }

    public getGameConnections() : GameConnection[] {
        return this.gameConnections
    }

    public addGameConnection(gameConnection : GameConnection){
        this.gameConnections.push(gameConnection);
    }

    public removeGameConnection(roomData : RoomData){
        this.gameConnections.forEach((gameConnection : GameConnection, i : number) =>{
            if(gameConnection.roomData.userId == roomData.userId && gameConnection.roomData.gameName == roomData.gameName) {      
                //remove the disconnected player player from players array
                this.gameConnections.splice(i, 1)    
            }
        })
    }

    public addUnitySocketToGameConnection(roomData : RoomData, socket : SocketIO.Socket){
        const foundIndex = this.gameConnections.findIndex((gameConnection) => {
            return gameConnection.roomData.gameName == roomData.gameName && gameConnection.unitySocket == null && gameConnection.roomData.userId == roomData.userId
        });
        if(foundIndex >= 0){
           this.gameConnections[foundIndex].unitySocket = socket;
        }        
    }

    public isDuplicate(roomData : RoomData){
        console.log( this.getGameConnections())
        let isDuplicate = false
        this.getGameConnections().forEach((gameConnection) =>{
            if(gameConnection.roomData.userId == roomData.userId && gameConnection.roomData.gameName == roomData.gameName){
                isDuplicate = true;
            }
        })

        return isDuplicate
    }

    public static getGameInstance(): Game  {
        if(!Game.GameInstance){
            Game.GameInstance = new Game()
        }
        return Game.GameInstance
    }
}

      

