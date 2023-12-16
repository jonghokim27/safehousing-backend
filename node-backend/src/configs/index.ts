import path from 'path';
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../configs/.env") });

/**
 * Auth
 */

export const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

/**
 * DB
 */

export const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : "";
export const DB_USER = process.env.DB_USER ? process.env.DB_USER : "";
export const DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "";
export const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
export const DB_DEFAULT_SCHEMA = process.env.DB_DEFAULT_SCHEMA ? process.env.DB_DEFAULT_SCHEMA : "";

/**
 * AWS
 */

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY ? process.env.AWS_ACCESS_KEY : "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : "";

export const AWS_SQS_REAL_ESTATE_REGION = "ap-northeast-2";
export const AWS_SQS_REAL_ESTATE_URL = "https://sqs.ap-northeast-2.amazonaws.com/411535489315/realEstate";

export const AWS_SQS_CORPORATE_REGION = "ap-northeast-2";
export const AWS_SQS_CORPORATE_URL = "https://sqs.ap-northeast-2.amazonaws.com/411535489315/corporate";


/**
 * Auth
 */
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : "";