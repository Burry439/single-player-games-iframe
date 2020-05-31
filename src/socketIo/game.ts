
import { gameConnection } from "../interfaces/gameConnection";

export default class Game {

    private static GameInstance : Game;
   // private playerId : String;
    private gameConnections : gameConnection[]
    private constructor(){
        this.gameConnections = []
    }

    public getGameConnections() : gameConnection[] {
        return this.gameConnections
    }

    public addGameConnection(gameConnection : gameConnection){
        this.gameConnections.push(gameConnection);
    }

    public removeGameConnection(userId : string){
        this.gameConnections.forEach((gameConnection : gameConnection, i : number) =>{
            if(gameConnection.roomData.userId == userId) {      
                //remove the disconnected player player from players array
                this.gameConnections.splice(i, 1)    
            }
        })
    }

    public addUnitySocketToGameConnectionAndGetId(gameName : string, socket : SocketIO.Socket){
        let id : string = "0"
        const foundIndex = this.gameConnections.findIndex((gameConnection) => {
            return gameConnection.roomData.gameName == gameName && gameConnection.unitySocket == null
        });
        if(foundIndex >= 0){
           this.gameConnections[foundIndex].unitySocket = socket;
           id = this.gameConnections[foundIndex].roomData.userId
        }

        return id;
        
    }

    public isDuplicate(userId : string){
        let isDuplicate = false
        this.gameConnections.forEach((gameConnection) =>{
            if(gameConnection.roomData.userId == userId){
                return isDuplicate = true;
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

      

