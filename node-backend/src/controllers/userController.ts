/**
 * Module dependencies
 */

import { Request, Response } from 'express';
import ssoAuth, { genUserId, ssoProviders, SSOUserData } from '../modules/ssoAuth';
import { Sequelize } from 'sequelize';
import { genAccessToken } from '../modules/userAuth';
import { User } from '../models/User';

/**
 * userController - login
*/
export const login = async(req: Request, res: Response) => {
    try{
        let { provider, token } = req.body;
        if(!ssoProviders.includes(provider)){
            return res.status(400).send({
                error: true,
                message: "Invalid SSO Provider"
            });
        }
        if(!token || token == ""){
            return res.status(400).send({
                error: true,
                message: "No SSO Token supplied"
            });
        }

        let ssoUserData: SSOUserData | false = await ssoAuth(provider, token);
        if(!ssoUserData){
            return res.status(400).send({
                error: true,
                message: "Invalid SSO Token"
            });
        }

        let id: string = ssoUserData.userId;
        id = genUserId(provider, id);

        let user: User;

        const {count: userCount, rows: userRows} = await User.findAndCountAll({
            logging: false,
            where: {
                id: id
            },
            limit: 1
        })

        // If user does not exist in DB, create new user
        if(userCount == 0){
            user = await User.create({
                id: id,
                email: ssoUserData.email,
                name: ssoUserData.nickname,
                createdAt: new Date()
            }, {
                logging: false
            });
        } else{
            user = userRows[0];
            await User.update({
                updatedAt: Sequelize.literal("NOW()")
            }, {
                logging: false,
                where: {
                    id: id
                },
                limit: 1
            })
        }
   
        let accessToken = genAccessToken({
            id: user.id,
            name: user.name,
            email: user.email
        });

        return res.status(200).send({
            error: false,
            accessToken: accessToken
        });
    } catch(e: any){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};

/**
 * userController - profile
*/
export const profile = async(req: Request, res: Response) => {
    try{
        let user: User = res.locals.user;

        return res.status(200).send({
            error: false,
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch(e: any){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};