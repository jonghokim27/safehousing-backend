/**
 * Module dependencies
 */

import express, { Router, Request, Response } from 'express';
import userAuth from '../modules/userAuth';

/**
 * Express Router
 */

const router: Router = express.Router();

// GET / (Health Check)
router.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ error: false, message: "Success" });
});

router.use(userAuth);

// User Router
router.use("/user", require("./userRouter"));

// Real Estate Router
router.use("/realEstate", require("./realEstateRouter"));

// Corporate Router
router.use("/corporate", require("./corporateRouter"));

module.exports = router;
