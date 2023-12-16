/**
 * Module dependencies
 */
import { Request } from 'express';

/**
 * Get Access/Refresh Token from Request Header
 * @param {string} type "access" | "refresh"
 * @param {Request} req Express Request
 * @returns {string | false} Access/Refresh Token
 */
export const getTokenFromReq = (type: string, req: Request): string | false => {
    try{
       if(type == "access"){
            let accessToken: string = req.headers.authorization ? req.headers.authorization : "";

            if(accessToken.substr(0,6) != "Bearer")
                return false;

            accessToken = accessToken.split("Bearer ")[1];
            return accessToken;
       }
       else if(type == "refresh"){
            let refreshToken: string = req.headers['refresh-token'] ? req.headers['refresh-token']?.toString() : "";

            return refreshToken;
       }
       else{
            return false;
       }
    }
    catch(e: any){
        return false;
    }
};