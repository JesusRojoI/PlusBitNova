// src/services/octano-api.ts
'use server';

// ============================================
// CONFIGURACIÓN - Usando las variables correctas
// ============================================
const OCTANO_BASE_URL = process.env.OCTANO_BASE_URL || 'https://pagos.octanopayments.com/api/v1';
const OCTANO_EMAIL = process.env.OCTANO_EMAIL;
const OCTANO_PASSWORD = process.env.OCTANO_PASSWORD;

// Estado de autenticación
let authToken: string | null = null;
let tokenExpiry: number | null = null;

// ============================================
// 1. AUTENTICACIÓN
// ============================================
export async function authenticateOctano(): Promise<string> {
  // Verificar si el token aún es válido (15 minutos)
  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return authToken; // ✅ authToken es string aquí porque la condición verifica que no sea null
  }

  try {
    console.log('🔐 Autenticando con Octano...');
    
    // Verificar credenciales
    if (!OCTANO_EMAIL || !OCTANO_PASSWORD) {
      console.warn('⚠️ Credenciales de Octano no configuradas. Usando modo simulación.');
      return 'simulated-token-12345';
    }

    const response = await fetch(`${OCTANO_BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: OCTANO_EMAIL,
        password: OCTANO_PASSWORD,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error de autenticación con Octano');
    }

    const data = await response.json();
    
    if (!data.authToken) {
      throw new Error('No se recibió token de autenticación');
    }

    authToken = data.authToken;
    tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutos
    console.log('✅ Autenticación exitosa');
    return authToken as string;
  } catch (error) {
    console.error('❌ Error autenticando con Octano:', error);
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Usando token simulado para desarrollo');
      return 'simulated-token-12345';
    }
    throw error;
  }
}

export async function getOctanoToken(): Promise<string> {
  return await authenticateOctano();
}

// ============================================
// 2. TOKENIZACIÓN DE TARJETA
// ============================================
interface TokenizeCardRequest {
  cardNumber: string;
  cardExpiration: string;
  cardCVC: string;
  cardHolder: string;
}

interface TokenizeCardResponse {
  token: string;
  last4: string;
  cardId: string;
}

export async function tokenizeCard(cardData: TokenizeCardRequest): Promise<TokenizeCardResponse> {
  try {
    const token = await getOctanoToken();

    if (token === 'simulated-token-12345') {
      console.log('🔐 Simulando tokenización de tarjeta...');
      return {
        token: `tok_sim_${Math.random().toString(36).substring(2, 11)}`,
        last4: cardData.cardNumber.slice(-4),
        cardId: `card_sim_${Date.now()}`,
      };
    }

    const [month, year] = cardData.cardExpiration.split('/');

    const response = await fetch(`${OCTANO_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        cardData: {
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          cardholderName: cardData.cardHolder,
          expirationYear: `20${year}`,
          expirationMonth: month,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error tokenizando tarjeta');
    }

    const data = await response.json();
    return {
      token: data.cardNumberToken || data.token,
      last4: cardData.cardNumber.slice(-4),
      cardId: data.cardId || `card_${Date.now()}`,
    };
  } catch (error) {
    console.error('❌ Error tokenizando tarjeta:', error);
    throw error;
  }
}

// ============================================
// 3. VALIDAR USUARIO
// ============================================
interface ValidateUserRequest {
  email: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
}

export async function validateUser(userData: ValidateUserRequest): Promise<boolean> {
  try {
    // Validación básica local
    if (!userData.email || !userData.nombre || !userData.apellidos) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return false;
    }

    console.log('✅ Usuario validado:', userData.email);
    return true;
  } catch (error) {
    console.error('❌ Error validando usuario:', error);
    return false;
  }
}

// ============================================
// 4. CREAR PEDIDO / PROCESAR PAGO
// ============================================
interface OrderRequest {
  user: {
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
  };
  shipping: {
    calle: string;
    numero: string;
    apartamento?: string;
    poblacion: string;
    provincia: string;
    codigoPostal: string;
    pais: string;
  };
  products: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
    unit: string;
  }>;
  payment: {
    cardToken: string;
    amount: number;
    iva: number;
    subtotal: number;
  };
  notes?: string;
  coupon?: string;
}

interface OrderResponse {
  orderId: string;
  status: 'pending' | 'approved' | 'rejected';
  transactionId: string;
  message?: string;
}

export async function createOrder(orderData: OrderRequest): Promise<OrderResponse> {
  try {
    const token = await getOctanoToken();

    // MODO SIMULACIÓN
    if (token === 'simulated-token-12345') {
      console.log('📦 Simulando creación de pedido...');
      // Simular un pequeño retraso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular que el pago es aprobado (puedes cambiar a 'rejected' para probar)
      const isApproved = true;
      
      return {
        orderId: `ORD-SIM-${Date.now()}`,
        status: isApproved ? 'approved' : 'rejected',
        transactionId: `TXN-SIM-${Date.now()}`,
        message: isApproved ? 'Pago simulado exitosamente' : 'Pago simulado rechazado',
      };
    }

    // MODO REAL
    const total = orderData.payment.amount;

    const salePayload = {
      amount: Number(total),
      currency: '484',
      reference: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerInformation: {
        firstName: orderData.user.nombre?.trim() || 'N/A',
        lastName: orderData.user.apellidos?.trim() || 'N/A',
        email: orderData.user.email,
        phone1: orderData.user.telefono || '',
        address1: `${orderData.shipping.calle} ${orderData.shipping.numero}`,
        address2: orderData.shipping.apartamento || '',
        city: orderData.shipping.poblacion,
        state: orderData.shipping.provincia,
        postalCode: orderData.shipping.codigoPostal,
        country: orderData.shipping.pais || 'MX',
        ip: '127.0.0.1',
      },
      cardData: {
        cardNumberToken: orderData.payment.cardToken,
        cvv: '000',
      },
      metadata: {
        productos: JSON.stringify(orderData.products),
        notas: orderData.notes || '',
        cupon: orderData.coupon || '',
        subtotal: orderData.payment.subtotal,
        iva: orderData.payment.iva,
      },
    };

    const response = await fetch(`${OCTANO_BASE_URL}/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(salePayload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error procesando pago');
    }

    const data = await response.json();

    return {
      orderId: salePayload.reference,
      status: data.status === 'APPROVED' ? 'approved' : 'rejected',
      transactionId: data.transactionId || data.id || `TXN-${Date.now()}`,
      message: data.message || (data.status === 'APPROVED' ? 'Pago aprobado' : 'Pago rechazado'),
    };
  } catch (error) {
    console.error('❌ Error creando pedido:', error);
    throw error;
  }
}