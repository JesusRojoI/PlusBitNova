'use client';

import { useState } from 'react';
import { processOctanoPayment } from '@/lib/payments/octano';

interface PaymentFormProps {
  amount: number;
  planId?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  buttonText?: string;
}

export function PaymentForm({ 
  amount, 
  planId = 'basic', 
  onSuccess, 
  onError,
  buttonText = 'Pagar ahora'
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
    customerName: '',
    customerLastName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerState: '',
    customerZip: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Preparar datos para el pago
      const paymentData = {
        amount: amount,
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        cardData: {
          number: formData.cardNumber,
          name: formData.cardName,
          month: formData.cardMonth,
          year: formData.cardYear,
          cvv: formData.cardCvv
        },
        customer: {
          nombre: formData.customerName,
          apellido: formData.customerLastName,
          email: formData.customerEmail,
          telefono: formData.customerPhone,
          direccion: formData.customerAddress,
          ciudad: formData.customerCity,
          estado: formData.customerState,
          cp: formData.customerZip,
          pais: "MX"
        },
        metadata: {
          ip: '127.0.0.1',
          plan: planId
        }
      };

      // 2. Procesar pago con Octano (Server Action)
      const result = await processOctanoPayment(paymentData);

      if (result.success) {
        onSuccess?.(result);
        // Redirigir a página de éxito
        window.location.href = `/finalizar-compra?success=true&orderId=${result.orderId}`;
      } else {
        onError?.(result.error || 'Error en el pago');
      }
    } catch (error: any) {
      onError?.(error.message || 'Error procesando el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Datos de la tarjeta</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Número de tarjeta</label>
        <input
          type="text"
          name="cardNumber"
          placeholder="4111 1111 1111 1111"
          value={formData.cardNumber}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre del titular</label>
        <input
          type="text"
          name="cardName"
          placeholder="Como aparece en la tarjeta"
          value={formData.cardName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Mes</label>
          <input
            type="text"
            name="cardMonth"
            placeholder="MM"
            maxLength={2}
            value={formData.cardMonth}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Año</label>
          <input
            type="text"
            name="cardYear"
            placeholder="YY"
            maxLength={2}
            value={formData.cardYear}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CVV</label>
          <input
            type="text"
            name="cardCvv"
            placeholder="CVV"
            maxLength={4}
            value={formData.cardCvv}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6">Datos del cliente</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Apellido</label>
          <input
            type="text"
            name="customerLastName"
            value={formData.customerLastName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Teléfono</label>
        <input
          type="text"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Dirección</label>
        <input
          type="text"
          name="customerAddress"
          value={formData.customerAddress}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Ciudad</label>
          <input
            type="text"
            name="customerCity"
            value={formData.customerCity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <input
            type="text"
            name="customerState"
            value={formData.customerState}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Código Postal</label>
        <input
          type="text"
          name="customerZip"
          value={formData.customerZip}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Procesando...' : buttonText}
      </button>
    </form>
  );
}