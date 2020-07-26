import express, { Request, Response, NextFunction }  from "express";
import http, { Server } from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import path from "path"
import SocketInstance from "./socketIo/socketInstance";
import RoomData from "./interfaces/roomData";
import { GameConnection } from "./interfaces/gameConnection";
import cookieParser from "cookie-parser"
import session, { Store } from "express-session"
import connectMongo, { MongoStoreFactory }  from "connect-mongo"
import mongoose, { connect, connection, Connection }  from 'mongoose';
import AuthHelper from "./helperClasses/authHelper";
dotenv.config()


class ExpressServer {
  private app: express.Application;
  private server : Server;
  public static socketInstance : SocketInstance;
  constructor(){
    const MongoStore : MongoStoreFactory = connectMongo(session)
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      autoIndex: true, //this is the code I added that solved it all
      useFindAndModify: false,
      useUnifiedTopology: true
  }
    mongoose.connect(process.env.MONGODB_URI, options);

    const sessionStore : Store = new MongoStore({
      mongooseConnection : mongoose.connection,
      collection : "sessions"
    })
    const cookieSettings = {httpOnly: true,  maxAge: 1000 *  60 * 60 * 24 }
    this.app  = express () 
    this.app.use(session({secret: process.env.SESSION_SECRET, unset: 'destroy', resave: false,saveUninitialized: false, cookie: cookieSettings, store : sessionStore}))
    this.app.use ( bodyParser.json ( { 'limit' : '50mb' } ) )
    this.app.use ( bodyParser.urlencoded ( { 'extended' : true , 'limit' : '50mb' } ) )
    this.app.use ( cors ( { 'origin' : '*' , 'methods' : [ '*' , 'DELETE' , 'GET' , 'OPTIONS' , 'PATCH' , 'POST' ] , 'allowedHeaders' : [ '*' , 'authorization' , 'content-type' ] } ) )
    //this.app.use(this.router)


     this.app.use( '/', AuthHelper.authenticateGameRequest, express.static('build/games'))


    this.app.get("*",(req,res) =>{
      
      const gameName = req.originalUrl.substring(0, req.originalUrl.indexOf('?')).replace(/[^a-zA-Z ]/g, "")
      const userId = Object.keys(req.query)[0]
      const roomData : RoomData = {userId : userId, gameName : gameName}
      setTimeout(() => {
        sendErrorIframe(roomData)
      }, 5000);
      
      
      res.sendFile(path.join("build/errorPage/error.html"),{ root: process.env.ROOT_FOLDER })
    })

    this.server  = http.createServer ( this.app )
    this.server.listen ( process.env.PORT || 8000)
    ExpressServer.socketInstance = SocketInstance.getSocketInstance(this.server) 

    console.log ( '=====================================' )
    console.log ( 'SERVER SETTINGS:' )
    console.log ( `Server running at - localhost:8000`)
    console.log ( '=====================================' )
  }

  public static initSerever() : ExpressServer{
    return new ExpressServer()
  }
}

const sendErrorIframe = (roomData : RoomData) => {
  const gameConnection : GameConnection = ExpressServer.socketInstance.gameInstance.getGameConnection(roomData)
  if(gameConnection){
    gameConnection.reactSocket.emit("gameReady")
  }
}

ExpressServer.initSerever()