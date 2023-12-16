/**
 * Module dependencies
 */

import crypto from 'crypto';
import * as AWS from 'aws-sdk';
import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } from '../configs';

/**
 * Upload text data to S3 Bucket
 * @param {string} data Data to upload
 * @returns {(Promise<string | false>)} Uploaded file name
 */
export const uploadText = async (data: string): Promise<string | false> => {
    try{
        let fileName: string = Date.now().toString() + (Math.floor(Math.random() * 100000000) + 1).toString();
        fileName = crypto.createHash('sha512').update(fileName).digest('hex');
        fileName = fileName.substring(0, 50) + ".txt";

        const S3 = new AWS.S3({
            accessKeyId: AWS_ACCESS_KEY,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: ""
        });

        await S3.upload({
            'Bucket': "",
            'Key': fileName,
            'ACL': 'private',
            'Body': data,
            'ContentType': 'text/txt'
        }).promise();

        return fileName;
    }
    catch(e: any){
        return false;
    }
};