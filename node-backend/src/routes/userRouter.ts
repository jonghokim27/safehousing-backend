/**
 * Module dependencies
 */

import { Router } from 'express';
import * as userController from '../controllers/userController';

/**
 * Express Router
 */

const router: Router = Router();

// POST /user/login
router.post("/login", userController.login);

// GET /user/profile
router.get("/profile", userController.profile);


module.exports = router;
