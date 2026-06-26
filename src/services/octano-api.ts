// src/services/octano-api.ts

const OCTANO_API_URL = process.env.NEXT_PUBLIC_OCTANO_API_URL || "https://api.octano.com/v1";
const CLIENT_ID = process.env.NEXT_PUBLIC_OCTANO_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_OCTANO_CLIENT_SECRET;

// ============================================
// 1. AUTENTICACIÓN - Obtener token JWT
// ============================================
export async function authenticateOctano(): Promise<string> {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.warn("⚠️ Credenciales de Octano no configuradas. Usando modo simulación.");
      return "simulated-token-12345";
    }

    const response = await fetch(`${OCTANO_API_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error de autenticación con Octano");
    }

    const data = await response.json();
    const token = data.access_token;

    localStorage.setItem("octano_token", token);
    localStorage.setItem("octano_token_expires", String(Date.now() + data.expires_in * 1000));

    return token;
  } catch (error) {
    console.error("Error autenticando con Octano:", error);
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Usando token simulado para desarrollo");
      return "simulated-token-12345";
    }
    throw error;
  }
}

export async function getOctanoToken(): Promise<string> {
  const token = localStorage.getItem("octano_token");
  const expires = localStorage.getItem("octano_token_expires");

  if (!token || !expires || Date.now() > Number(expires)) {
    return await authenticateOctano();
  }

  return token;
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

    if (process.env.NODE_ENV === "development" && token === "simulated-token-12345") {
      console.log("🔐 Simulando tokenización de tarjeta...");
      return {
        token: `tok_sim_${Math.random().toString(36).substr(2, 9)}`,
        last4: cardData.cardNumber.slice(-4),
        cardId: `card_sim_${Date.now()}`,
      };
    }

    const [month, year] = cardData.cardExpiration.split("/");

    const response = await fetch(`${OCTANO_API_URL}/payment/tokenize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        card_number: cardData.cardNumber.replace(/\s/g, ""),
        card_expiration_month: month,
        card_expiration_year: `20${year}`,
        card_cvc: cardData.cardCVC,
        card_holder: cardData.cardHolder,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error tokenizando tarjeta");
    }

    const data = await response.json();
    return {
      token: data.token,
      last4: data.last4,
      cardId: data.card_id,
    };
  } catch (error) {
    console.error("Error tokenizando tarjeta:", error);
    throw error;
  }
}

// ============================================
// 3. CREAR PEDIDO / PROCESAR PAGO
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
  status: "pending" | "approved" | "rejected";
  transactionId: string;
  message?: string;
}

export async function createOrder(orderData: OrderRequest): Promise<OrderResponse> {
  try {
    const token = await getOctanoToken();

    if (process.env.NODE_ENV === "development" && token === "simulated-token-12345") {
      console.log("📦 Simulando creación de pedido...", orderData);
      return {
        orderId: `ORD-SIM-${Date.now()}`,
        status: "approved",
        transactionId: `TXN-SIM-${Date.now()}`,
        message: "Pedido simulado exitosamente",
      };
    }

    const response = await fetch(`${OCTANO_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer: {
          name: `${orderData.user.nombre} ${orderData.user.apellidos}`,
          email: orderData.user.email,
          phone: orderData.user.telefono,
        },
        shipping_address: {
          street: orderData.shipping.calle,
          number: orderData.shipping.numero,
          apartment: orderData.shipping.apartamento || "",
          city: orderData.shipping.poblacion,
          state: orderData.shipping.provincia,
          zip_code: orderData.shipping.codigoPostal,
          country: orderData.shipping.pais,
        },
        items: orderData.products.map((p) => ({
          product_id: p.id,
          name: p.title,
          quantity: p.quantity,
          unit_price: p.price,
          total: p.price * p.quantity,
        })),
        payment: {
          card_token: orderData.payment.cardToken,
          amount: orderData.payment.amount,
          subtotal: orderData.payment.subtotal,
          tax: orderData.payment.iva,
        },
        notes: orderData.notes || "",
        coupon: orderData.coupon || "",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error creando pedido");
    }

    const data = await response.json();
    return {
      orderId: data.order_id,
      status: data.status,
      transactionId: data.transaction_id,
      message: data.message,
    };
  } catch (error) {
    console.error("Error creando pedido:", error);
    throw error;
  }
}

// ============================================
// 4. VALIDAR INFORMACIÓN DEL USUARIO
// ============================================
interface ValidateUserRequest {
  email: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
}

export async function validateUser(userData: ValidateUserRequest): Promise<boolean> {
  try {
    const token = await getOctanoToken();

    if (process.env.NODE_ENV === "development" && token === "simulated-token-12345") {
      console.log("✅ Simulando validación de usuario:", userData.email);
      return true;
    }

    const response = await fetch(`${OCTANO_API_URL}/customer/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userData.email,
        name: `${userData.nombre} ${userData.apellidos}`,
        phone: userData.telefono || "",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error validando usuario");
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error("Error validando usuario:", error);
    return true;
  }
}