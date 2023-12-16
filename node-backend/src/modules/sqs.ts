/**
 * Module dependencies
 */

import * as AWS from 'aws-sdk';
import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } from '../configs';

/**
 * Send message to SQS
 * @param {string} queueUrl SQS Queue URL
 * @param {string} data Data to send
 * @returns {(Promise<boolean>)}
 */
export const sendMessage = async (region: string, queueUrl: string, data: string): Promise<boolean> => {
    try{
        const SQS = new AWS.SQS({
            accessKeyId: AWS_ACCESS_KEY,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: region
        })
        await SQS.sendMessage({MessageBody: data, QueueUrl: queueUrl}).promise();
        return true;
    }
    catch(e: any){
        return false;
    }
};