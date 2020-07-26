import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken"

export default class AuthHelper{
    
    public static  authenticateGameRequest = (req: Request, res: Response, next: NextFunction) =>{
        const token : string =  req.session.jwt
        console.log(req.headers.referer)
        if(req.headers.referer == undefined)  return res.sendStatus(401)
        if(token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err : Error,user : any) =>{
              if(err) return res.sendStatus(403)
              //req.user = user
              next()
        })
    }
}