/**
 * Module dependencies
 */

import axios from 'axios';
import * as iconv from 'iconv-lite';
import { Request, Response } from 'express';
import { parse } from 'node-html-parser';
import { encode } from 'urlencode';
import { RealEstateType } from '../configs/enum';
import { RealEstate } from '../models/RealEstate';
import { User } from '../models/User';
import { sendMessage } from '../modules/sqs';
import { AWS_SQS_REGION, AWS_SQS_URL } from '../configs';

/**
 * realEstateController - search
*/
export const search = async(req: Request, res: Response) => {
    try{
        let { query } = req.query;
        if(!query){
            return res.status(400).send({
                error: true,
                message: "No query supplied"
            });
        }

        let queryEncoded = query.toString();
        queryEncoded = encode(queryEncoded, "euc-kr");

        let irosLoginRes = await axios.get("http://www.iros.go.kr/frontservlet", {timeout: 5000});
        let setCookies = irosLoginRes.headers['set-cookie'];
        if(!setCookies){
            throw "No set-cookie header";
        }

        let cookieStr = "";
        for await(let setCookie of setCookies){
            cookieStr += setCookie.split(";")[0] + "; ";
        }
        
        let axiosRes = await axios.get("http://www.iros.go.kr/frontservlet?cmd=RISUConfirmSimpleC&selkindcls=&vAddrCls=3&txt_addr_cls=false&e001admin_regn1=&e001admin_regn2=&e001admin_regn3=&a312lot_no=&e001rd_name=&rd_buld_no=&rd_buld_no2=&a301buld_name=&a301buld_no_buld=&a301buld_no_room=&y202pay_no_docs=1&y202cmort_flag=N&y202issue_cls=5&y202trade_seq_flag=N&fromSms=null&fromPub=&y906alt_svc_gb=0&cls_flag=%C7%F6%C7%E0&txt_simple_address="+ queryEncoded +"&connCls=&MenuID=IR010001&pinFlag=N&ENTRY=VW&elecCase=N&Pass=&elecCaseGb=", {timeout: 5000, responseType: "arraybuffer", headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Host': 'www.iros.go.kr',
            'Cookie': cookieStr
        }});
        let html = axiosRes.data;
        html = iconv.decode(html, "EUC-KR").toString();

        let root = parse(html);
        let list_table = root.querySelector(".list_table");
        if(!list_table){
            throw "list_table is null";
        }

        let tbody = list_table.querySelector("tbody");
        if(!tbody){
            throw "tbody is null";
        }

        let trs = tbody.querySelectorAll("tr");
        let results = [];
        for await(var tr of trs){
            let tds = tr.querySelectorAll("td");
            if(!tds){
                continue;
            }

            let regId = tds[0].text;
            regId = regId.replace(/(\r\n|\n|\t|\r)/gm, "");
            let type = tds[1].text;
            type = type.replace(/(\r\n|\n|\t|\r)/gm, "");
            let address = tds[2].text;
            address = address.replace(/(\r\n|\n|\t|\r)/gm, "");
            
            results.push({
                regId,
                type,
                address
            });
        }

        return res.status(200).send({
            error: false,
            results: results
        });
    } catch(e: any){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};

/**
 * realEstateController - request
*/
export const request = async(req: Request, res: Response) => {
    try{
        let { regId, type, address } = req.body;
        let user: User = res.locals.user;

        if(!regId || !type || !address){
            return res.status(400).send({
                error: true,
                message: "No regId or type or address supplied"
            });
        }

        if(type != RealEstateType.Apartment && type != RealEstateType.Building && type != RealEstateType.Land){
            return res.status(400).send({
                error: true,
                message: "Invalid type"
            });
        }

        let realEstate = await RealEstate.create({
            UserId: user.id,
            regId: regId,
            type: type,
            status: 0,
            address: address,
            createdAt: new Date()
        }, {
            logging: false
        })

        let sendMessageRes = await sendMessage(AWS_SQS_REGION, AWS_SQS_URL, JSON.stringify({
            type: "realEstate",
            idx: realEstate.idx
        }));
        if(!sendMessageRes){
            throw "Could not send message to SQS";
        }

        return res.status(200).send({
            error: false,
            idx: realEstate.idx
        });
    } catch(e: any){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};

/**
 * realEstateController - status
*/
export const status = async(req: Request, res: Response) => {
    try{
        let { idx } = req.query;
        if(!idx){
            return res.status(400).send({
                error: true,
                message: "No idx supplied"
            });
        }

        let realEstate = await RealEstate.findOne(
        {
            logging: false,
            where: {
                idx: Number(idx)
            }
        });
        if(!realEstate){
            return res.status(400).send({
                error: true,
                message: "Invalid idx"
            });
        }

        return res.status(200).send({
            error: false,
            status: realEstate.status
        });
    } catch(e: any){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};

/**
 * realEstateController - list
*/
export const list = async(req: Request, res: Response) => {
    try{
        let user: User = res.locals.user;

        let realEstates = await RealEstate.findAll(
        {
            logging: false,
            attributes: ['idx', 'regId', 'type', 'status', 'address', 'pdfUrl', 'pdfSummary', 'createdAt'],
            where: {
                UserId: user.id
            },
            order: [
                ['idx', 'DESC']
            ]
        });
        
        return res.status(200).send({
            error: false,
            realEstates: realEstates
        });
    } catch(e: any){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};