// src/routes/paymentRoutes.js
import express from 'express';
import { 
    showCheckout, 
    processPayment, 
    paymentSuccess, 
    paymentCancel 
} from '../controllers/paymentController.js';

const router = express.Router();

// Rutas públicas
router.get('/checkout', showCheckout);
router.post('/process', processPayment);
router.get('/success', paymentSuccess);
router.get('/cancel', paymentCancel);

export default router;