import type { Metadata } from "next";
import { ServicePage, type ServicePageData } from "@/components/service/service-page";

export const metadata: Metadata = {
  title: "Seguridad Informática – SafeWare",
  description:
    "La seguridad informática es esencial en un mundo cada vez más conectado.",
};

const data: ServicePageData = {
  title: "Seguridad Informática",
  heroSubtitle: (
    <>
      La <strong className="font-bold text-slate-700">seguridad informática</strong>{" "}
      es esencial en un mundo cada vez más conectado.
    </>
  ),
  heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop&crop=center",
  servicioHeading: "Seguridad digital sólida para empresas modernas",
  servicioImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=500&fit=crop&crop=center",
  servicioText: (
    <>
      Ofrecemos soluciones de{" "}
      <strong className="font-bold">seguridad informática</strong>{" "}
      diseñadas para proteger la información crítica de tu empresa frente a
      amenazas digitales. Implementamos medidas preventivas, detección avanzada
      y respuestas rápidas para garantizar la integridad, confidencialidad y
      disponibilidad de tus datos.
    </>
  ),
  note: "Nuestros paquetes de servicios incluyen únicamente lo especificado en la descripción de cada uno:",
  variant: "features",
  services: [
    {
      title: "McAfee Total Protection",
      price: "900",
      unit: "MXN + IVA",
      features: [
        "Protección contra virus, malware, ransomware y spyware.",
        "Incluye herramientas de privacidad y gestión de contraseñas.",
        "Compatible con Windows, macOS, Android e iOS.",
        "Un dispositivo",
      ],
    },
    {
      title: "Kaspersky Standard",
      price: "550",
      unit: "MXN + IVA",
      features: [
        "Protección esencial contra virus y malware.",
        "Incluye antivirus, firewall y protección de datos personales.",
        "Compatible con Windows.",
        "Un dispositivo",
      ],
    },
    {
      title: "Bitdefender Total Security",
      price: "780",
      unit: "MXN + IVA",
      features: [
        "Protección avanzada contra virus, ransomware y spyware.",
        "Protección avanzada contra virus, ransomware y spyware.",
        "Compatible con Windows, macOS, Android e iOS.",
        "Un dispositivo",
      ],
    },
    {
      title: "Norton AntiVirus Plus",
      price: "800",
      unit: "MXN + IVA",
      features: [
        "Protección contra virus, malware y ransomware.",
        "Incluye firewall, gestor de contraseñas y copia de seguridad en la nube.",
        "Compatible con Windows, macOS, Android e iOS.",
        "Un dispositivo",
      ],
    },
    {
      title: "TotalAV Antivirus",
      price: "2,000",
      unit: "MXN + IVA",
      features: [
        "Protección en tiempo real contra virus, malware y amenazas en línea.",
        "Incluye VPN, limpiador de navegador y gestor de contraseñas.",
        "Compatible con Windows, macOS, Android e iOS.",
        "Un dispositivo",
      ],
    },
  ],
};

export default function Page() {
  return <ServicePage data={data} />;
}