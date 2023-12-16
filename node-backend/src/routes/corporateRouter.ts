/**
 * Module dependencies
 */

import { Router } from 'express';
import * as corporateController from '../controllers/corporateController';

/**
 * Express Router
 */

const router: Router = Router();

// GET /corporate/search
router.get("/search", corporateController.search);

// POST /corporate/request
router.post("/request", corporateController.request);

// GET /corporate/status
router.get("/status", corporateController.status);

// GET /corporate/resultList
router.get("/list", corporateController.list);

module.exports = router;
