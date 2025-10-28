import express from 'express';
import { paymentFailed, paymentMethod, paymentSuccess } from "../controller/payment.controller.js";
const router = express.Router();


router.post("/payment/:userid", paymentMethod);

router.post("/success/:userid", paymentSuccess);

router.get("/failed", paymentFailed);


export default router;