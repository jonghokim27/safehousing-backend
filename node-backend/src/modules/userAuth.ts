/**
 * Module dependencies
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../configs';
import { Sequelize } from 'sequelize';
import { getTokenFromReq } from './common';
import { models } from '../models';

export interface UserPayload extends jwt.JwtPayload{
    id: string,
    name: string,
};

/**
 * Validate User Access Token (Express middleware)
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export default async(req: Request, res: Response, next: NextFunction) => {
    try{
        res.locals.user = null;
        let userValid: boolean = false;

        let accessToken: string | false = getTokenFromReq("access", req);

        if(accessToken && accessToken != ""){
            let userPayload: UserPayload;
            try{
                try{
                    userPayload = <UserPayload>jwt.verify(accessToken, JWT_SECRET_KEY);
                } catch(e){
                    throw "JWT Error";
                }

                const { count: userCount, rows: userRows } = await models.User.findAndCountAll({
                    logging: false,
                    where: {
                        id: userPayload.id
                    },
                    limit: 1
                })
        
                if(userCount == 0){
                    throw "User not existing in DB";
                }

                let user = userRows[0];
            
                await models.User.update({
                    updatedAt: Sequelize.literal("NOW()")
                }, {
                    logging: false,
                    where: {
                        id: userPayload.id
                    },
                    limit: 1
                })

                res.locals.user = user;

                userValid = true;
            }
            catch(e: any){
                userValid = false;
            }
            
        }

        let urlRequireAuth: boolean = true;

        //no accessToken required
        let pageURLs: Array<RegExp> = [
            /^\/user\/login/
        ];

        for await (var pageURL of pageURLs) {
            if (req.url.search(pageURL) != -1) {
                urlRequireAuth = false;
                break;
            }
        };

        if (urlRequireAuth && !userValid) {
            return res.status(401).json({
                error: true,
                message: "Login Required"
            });
        }
        else{
            next();
        }
    } catch(e: any){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
    
}

/**
 * Generate Access Token
 * @param {UserPayload} payload UserPayload
 * @returns {string} Generated Access Token
 */
export const genAccessToken = (payload: UserPayload): string => {
    let token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "120d"});
    return token;
}