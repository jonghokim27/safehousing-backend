/**
 * Module dependencies
 */

import { Router } from 'express';
import * as realEstateController from '../controllers/realEstateController';

/**
 * Express Router
 */

const router: Router = Router();

// GET /realEstate/search
router.get("/search", realEstateController.search);

// POST /realEstate/request
router.post("/request", realEstateController.request);

// GET /realEstate/status
router.get("/status", realEstateController.status);

// GET /realEstate/list
router.get("/list", realEstateController.list);

module.exports = router;
