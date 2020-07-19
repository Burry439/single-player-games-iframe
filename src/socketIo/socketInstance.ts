
import socketIo, { Socket } from 'socket.io';
import { Server } from 'http';
import Game from './game';
import ReactSocketListener from './reactSocketListener';
import UnitySocketListener from './unitySocketListener';
import RoomData  from '../interfaces/roomData';
import { GameData } from '../interfaces/gameData';
import ApiRequest from "../helperClasses/apiRequest";


export default class SocketInstance {
    private io : SocketIO.Server
    private static SocketInstance : SocketInstance 
    public gameInstance : Game =  Game.getGameInstance();
    public userId : string;
    apiRequest : ApiRequest
    constructor(server : Server) {
        this.apiRequest = ApiRequest.getApiRequestInstance();
        this.io = socketIo(server)
        
        this.io.on("connection", (socket : SocketIO.Socket) =>{
            console.log("connection")

            socket.on("ReactConnected",(roomData : RoomData) =>{
                console.log("react connected")
                new ReactSocketListener(socket, roomData)
            })

            socket.on("UnityConnection",async (roomData : RoomData) =>{
                const gameData : GameData = await this.getGameData(roomData.gameName)
                new UnitySocketListener(socket, roomData, gameData)
            })
        })
    }

     public async getGameData  (gameName : string){
         try{
             const res = await this.apiRequest.get("game", `getGame/?gameName=${gameName}`)
             return res.data;
         }catch(e){
             console.log(e)
         }
     }

    public static getSocketInstance(server : Server) : SocketInstance { 
        if(!SocketInstance.SocketInstance){
            SocketInstance.SocketInstance = new SocketInstance(server)
        }
        return SocketInstance.SocketInstance   
    }
}