import express  from "express";
import http, { Server } from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import path from "path"
import SocketInstance from "./socketIo/socketInstance";
dotenv.config()


class ExpressServer {
 // public socketInstance : SocketInstance;
  private app: express.Application;
  private server : Server;
  public socketInstance : SocketInstance;
  constructor(){
    this.app  = express () 
    this.app.use ( bodyParser.json ( { 'limit' : '50mb' } ) )
    this.app.use ( bodyParser.urlencoded ( { 'extended' : true , 'limit' : '50mb' } ) )
    this.app.use ( cors ( { 'origin' : '*' , 'methods' : [ '*' , 'DELETE' , 'GET' , 'OPTIONS' , 'PATCH' , 'POST' ] , 'allowedHeaders' : [ '*' , 'authorization' , 'content-type' ] } ) )
    //this.app.use(this.router)

    this.app.use( '/', express.static('build/games'))
    
    this.server   = http.createServer ( this.app )
    this.server.listen ( process.env.PORT || 8000)
    this.socketInstance = SocketInstance.getSocketInstance(this.server) 

    console.log ( '=====================================' )
    console.log ( 'SERVER SETTINGSbbbb:' )
    console.log ( `Server running at - localhost:8000`)
    console.log ( '=====================================' )
  }

  public static initSerever() : ExpressServer{
    return new ExpressServer()
}

}

ExpressServer.initSerever()