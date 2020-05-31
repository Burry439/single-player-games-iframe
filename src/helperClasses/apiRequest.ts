import axios from "axios"
import dotenv from 'dotenv'
dotenv.config()

export default class ApiRequest{

    private static ApiRequestInstance : ApiRequest;

    public async get(route : string, method : string){
        let response =  await axios.get(`${process.env.API_URL}/${route}/${method}`)
        return response;
    }

    public async post(route : string, method : string, body : any){
        let response =  await axios.post(`${process.env.API_URL}/${route}/${method}`,body)
        return response;
    }

    public static getApiRequestInstance(): ApiRequest  {
        if(!ApiRequest.ApiRequestInstance){
            ApiRequest.ApiRequestInstance = new ApiRequest()
        }
        return  ApiRequest.ApiRequestInstance
    }

}