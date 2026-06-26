import axios from 'axios';

const OCTANO_BASE_URL = process.env.OCTANO_BASE_URL || 'https://pagos.octanopayments.com/api/v1';

export async function processOctanoPayment(paymentData) {
    try {
        // 1. AUTENTICACIÓN
        console.log('🔐 Autenticando en Octano...');
        const authResponse = await axios.post(`${OCTANO_BASE_URL}/signin`, {
            email: process.env.OCTANO_USER,
            password: process.env.OCTANO_PASSWORD,
        });
        const authToken = authResponse.data.authToken;
        console.log('✅ Autenticación exitosa');

        // 2. TOKENIZACIÓN DE TARJETA (sin CVV)
        console.log('💳 Tokenizando tarjeta...');
        const card = paymentData.cardData;
        const tokenizeResponse = await axios.post(
            `${OCTANO_BASE_URL}/card/tokenizer`,
            {
                cardData: {
                    cardNumber: card.number.replace(/\s/g, ''), // Limpiar espacios
                    cardholderName: card.name,
                    expirationYear: card.year,
                    expirationMonth: card.month
                }
            },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );
        const cardToken = tokenizeResponse.data.cardNumberToken;
        console.log('✅ Tarjeta tokenizada');

        // 3. EJECUTAR VENTA
        console.log('💵 Procesando pago...');
        const salePayload = {
            amount: Number(paymentData.amount),
            currency: "484", // Código MXN
            reference: paymentData.orderId,
            customerInformation: {
                firstName: paymentData.customer.nombre?.trim() || "N/A",
                lastName: paymentData.customer.apellido?.trim() || "N/A",
                email: paymentData.customer.email,
                phone1: paymentData.customer.telefono,
                address1: paymentData.customer.direccion,
                address2: paymentData.customer.direccion2 || "",
                city: paymentData.customer.ciudad,
                state: paymentData.customer.estado,
                postalCode: paymentData.customer.cp,
                country: paymentData.customer.pais || "MX",
                company: paymentData.customer.empresa || "",
                ip: paymentData.metadata?.ip || "127.0.0.1",
            },
            cardData: {
                cardNumberToken: cardToken,
                cvv: paymentData.cardData.cvv,
            },
        };

        const saleResponse = await axios.post(
            `${OCTANO_BASE_URL}/sale`,
            salePayload,
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        console.log('✅ Pago procesado:', saleResponse.data.status);

        // 4. RETORNAR RESPUESTA
        return {
            success: saleResponse.data.status === "APPROVED",
            orderId: saleResponse.data.orderId,
            reference: saleResponse.data.reference,
            status: saleResponse.data.status,
            data: saleResponse.data,
            message: saleResponse.data.status === "APPROVED" 
                ? "Pago aprobado exitosamente" 
                : "El pago fue rechazado"
        };

    } catch (error) {
        console.error('❌ Error en Octano:', error.response?.data || error.message);
        return {
            success: false,
            status: "error",
            error: error.response?.data?.message || "Error procesando el pago con Octano",
            details: error.response?.data || error.message
        };
    }
}