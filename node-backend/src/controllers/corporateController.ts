/**
 * Module dependencies
 */

import axios from 'axios';
import * as iconv from 'iconv-lite';
import { Request, Response } from 'express';
import { parse } from 'node-html-parser';
import { encode } from 'urlencode';

/**
 * corporateController - search
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
        queryEncoded = escape(queryEncoded.replace(/\\/gi, "%"));
        queryEncoded = queryEncoded.replace(/%u/gi, ";");
        queryEncoded = queryEncoded.replace(";", "");
        queryEncoded = queryEncoded.replace("%20", ";32");
        
        let queryEncodedArr = queryEncoded.split(";");
        for(var i=0; i<queryEncodedArr.length; i++){
            if(queryEncodedArr[i] == "32"){
                continue;
            }
            queryEncodedArr[i] = parseInt(queryEncodedArr[i], 16).toString();
        }

        queryEncoded = queryEncodedArr.join(";") + ";";

        let irosLoginRes = await axios.get("http://www.iros.go.kr/ifrontservlet?cmd=IISUGetCorpFrmCallC&fromjunja=", {timeout: 5000});
        let setCookies = irosLoginRes.headers['set-cookie'];
        if(!setCookies){
            throw "No set-cookie header";
        }

        let cookieStr = "";
        for await(let setCookie of setCookies){
            cookieStr += setCookie.split(";")[0] + "; ";
        }
        
        let axiosRes = await axios.get("http://www.iros.go.kr/ifrontservlet?cmd=IISUCorpPopListC&SGC_RTVKWANHAL=0&SGC_RTVBUBINGB=0&SGC_StatusList=0&SGC_RmasterjiGb=0&SANGHO_NUM="+ queryEncoded +"&FLAG_SEARCH=S_SANGHO&TERM=0&SINTONG=1&flag=1&altSvcGb=0&MenuID=IC010001&eleccasegb=N&fromjunja=N", {timeout: 5000, responseType: "arraybuffer", headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Host': 'www.iros.go.kr',
            'Referer': 'http://www.iros.go.kr/ifrontservlet?cmd=IISUGetCorpHeadC&flag=1&ingam=N&MenuID=IC010001&eleccasegb=N',
            'Cookie': cookieStr
        }});
        let html = axiosRes.data;
        html = iconv.decode(html, "EUC-KR").toString();
        console.log(html);

        // let root = parse(html);
        // let list_table = root.querySelector(".list_table");
        // if(!list_table){
        //     throw "list_table is null";
        // }

        // let tbody = list_table.querySelector("tbody");
        // if(!tbody){
        //     throw "tbody is null";
        // }

        // let trs = tbody.querySelectorAll("tr");
        // let results = [];
        // for await(var tr of trs){
        //     let tds = tr.querySelectorAll("td");
        //     if(!tds){
        //         continue;
        //     }

        //     let regId = tds[0].text;
        //     regId = regId.replace(/(\r\n|\n|\t|\r)/gm, "");
        //     let type = tds[1].text;
        //     type = type.replace(/(\r\n|\n|\t|\r)/gm, "");
        //     let address = tds[2].text;
        //     address = address.replace(/(\r\n|\n|\t|\r)/gm, "");
            
        //     results.push({
        //         regId,
        //         type,
        //         address
        //     });
        // }

        return res.status(200).send({
            error: false,
            // results: results
        });
    } catch(e: any){
        console.log(e);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};