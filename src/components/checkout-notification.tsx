'use client';

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface CheckoutNotificationProps {
  type: "success" | "error" | null;
  message: string;
  onClose: () => void;
}

export function CheckoutNotification({ type, message, onClose }: CheckoutNotificationProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  if (!type || !visible) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-emerald-500/10" : "bg-red-500/10";
  const borderColor = isSuccess ? "border-emerald-500/20" : "border-red-500/20";
  const textColor = isSuccess ? "text-emerald-400" : "text-red-400";
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  // Traducir el título
  const getTitle = () => {
    if (isSuccess) {
      return t('notification_success') || "✅ ¡Éxito!";
    } else {
      return t('notification_error') || "❌ Error";
    }
  };

  return (
    <div className={`fixed top-24 right-4 z-50 max-w-sm w-full ${bgColor} border ${borderColor} rounded-xl p-4 shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-5 fade-in duration-300`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${textColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`${textColor} font-medium text-sm`}>
            {getTitle()}
          </p>
          <p className="text-white/80 text-sm">{message}</p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}