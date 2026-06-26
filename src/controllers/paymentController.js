import { processOctanoPayment } from '../lib/payments/octano.js';
import { sendEmail } from '../services/emailService.js';

// Mostrar formulario de pago
export const showCheckout = (req, res) => {
    const planId = req.query.plan || 'basic';
    const plans = {
        basic: { name: 'Básico', price: 29.99 },
        pro: { name: 'Profesional', price: 59.99 },
        enterprise: { name: 'Empresarial', price: 99.99 }
    };
    
    res.render('payment/checkout', {
        plan: plans[planId] || plans.basic,
        planId: planId
    });
};

// Procesar el pago
export const processPayment = async (req, res) => {
    try {
        const { 
            amount, 
            plan, 
            cardNumber, 
            cardName, 
            cardMonth, 
            cardYear, 
            cardCvv,
            customerName,
            customerLastName,
            customerEmail,
            customerPhone,
            customerAddress,
            customerCity,
            customerState,
            customerZip
        } = req.body;

        // 1. Preparar datos para el pago
        const paymentData = {
            amount: Number(amount),
            orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            cardData: {
                number: cardNumber,
                name: cardName,
                month: cardMonth,
                year: cardYear,
                cvv: cardCvv
            },
            customer: {
                nombre: customerName,
                apellido: customerLastName,
                email: customerEmail,
                telefono: customerPhone,
                direccion: customerAddress,
                ciudad: customerCity,
                estado: customerState,
                cp: customerZip,
                pais: "MX"
            },
            metadata: {
                ip: req.ip || req.connection.remoteAddress,
                plan: plan
            }
        };

        console.log('📝 Procesando pago para:', customerEmail);

        // 2. Procesar el pago con Octano
        const result = await processOctanoPayment(paymentData);

        // 3. Si el pago es exitoso
        if (result.success) {
            // Enviar correo de confirmación
            await sendEmail({
                to: customerEmail,
                template: 'paymentConfirmation',
                data: {
                    customerName: customerName,
                    amount: amount,
                    orderId: paymentData.orderId,
                    plan: plan
                }
            });

            // Renderizar página de éxito
            return res.render('payment/success', {
                orderId: paymentData.orderId,
                amount: amount,
                plan: plan,
                email: customerEmail
            });
        } else {
            // Si el pago falló
            return res.render('payment/error', {
                error: result.error || 'Error procesando el pago',
                orderId: paymentData.orderId
            });
        }

    } catch (error) {
        console.error('❌ Error en controlador:', error);
        res.render('payment/error', {
            error: 'Hubo un error procesando tu pago. Intenta nuevamente.',
            details: error.message
        });
    }
};

// Página de éxito (para redirección)
export const paymentSuccess = (req, res) => {
    res.render('payment/success', {
        orderId: req.query.orderId || 'N/A',
        amount: req.query.amount || '0',
        plan: req.query.plan || 'N/A'
    });
};

// Página de cancelación
export const paymentCancel = (req, res) => {
    res.render('payment/cancel');
};