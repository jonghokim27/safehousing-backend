/**
 * Module dependencies
 */

import morgan from 'morgan';
import cookieParser from "cookie-parser";
import express, { Express, Request, Response, NextFunction } from "express";
import { sequelize } from "./models";

/**
 * Express
 */

const app: Express = express();

sequelize.sync({ force: false, logging: false })
  .then(() => {
    console.log('✅ Connected to Database');
  })
  .catch((err) => {
    console.error(err);
  });


app.use(morgan("dev"));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

// Index Router
app.use("/", require("./routes/index"));

// 404 Error Handler
app.use(function (req: Request, res: Response, next: NextFunction) {
    return res.status(404).send();
});

// All Error Handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  return res.status(500).send();
});

export default app;