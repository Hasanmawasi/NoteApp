import express from "express";
import * as mainController from '../controllers/mainController.js'

export const router = express.Router();

 router.get("/", mainController.homepage);

 router.get("/about", mainController.aboutpage);

export default router;