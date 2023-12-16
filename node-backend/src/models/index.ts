/**
 * Module dependencies
 */
import { Sequelize } from "sequelize";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DEFAULT_SCHEMA } from "../configs";
import { initModels } from "./init-models";

/**
 * Initialize Sequelize
 */

export const sequelize = new Sequelize(DB_DEFAULT_SCHEMA, DB_USER, DB_PASSWORD, {
    port: DB_PORT, 
    host: DB_HOST, 
    pool: {
        max: 100, 
        min: 0, 
        acquire: 5000, 
        idle: 2
    }, dialect: "mysql"});

/**
 * Initialize Models
 */
export const models = initModels(sequelize);