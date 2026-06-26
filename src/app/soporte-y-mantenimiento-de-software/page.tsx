import type { Metadata } from "next";
import { ServicePage, type ServicePageData } from "@/components/service/service-page";

export const metadata: Metadata = {
  title: "Soporte y Mantenimiento de Software – SafeWare",
  description:
    "El soporte de TI administrado adecuado puede resolver problemas comerciales y hacer que tu empresa avance.",
};

const data: ServicePageData = {
  title: "Soporte y Mantenimiento de Software",
  heroSubtitle:
    "El soporte de TI administrado adecuado puede resolver problemas comerciales y hacer que tu empresa avance.",
  heroImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=600&fit=crop&crop=center",
  servicioHeading: "Soporte confiable para tecnología sin límites.",
  servicioImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&crop=center",
  servicioText: (
    <>
      Brindamos{" "}
      <strong className="font-bold text-white">
        soporte especializado y mantenimiento preventivo y correctivo
      </strong>{" "}
      para tus aplicaciones y sistemas. Nos enfocamos en mantener tu software
      actualizado, seguro y eficiente, reduciendo tiempos de inactividad y
      mejorando la productividad de tu empresa.
    </>
  ),
  note: "Nuestros paquetes de servicios incluyen únicamente lo especificado en la descripción de cada uno:",
  variant: "price",
  services: [
    {
      title: "Instalación o actualización de programa básico",
      desc: "Para equipo doméstico (navegador, antivirus o Office básico)",
      price: "500",
      unit: "MXN + IVA",
    },
    {
      title: "Instalar/configurar software corporativo",
      desc: "Para 2 usuarios (más licencias, configuración en red costo extra)",
      price: "2,000",
      unit: "MXN + IVA",
    },
    {
      title: "Actualizar versión de sistema operativo",
      desc: "Actualización completa o migración de una versión antigua a una moderna (por ejemplo Windows 10 → 11; o de Office 2016 → 2021) con configuración complementaria",
      price: "4,000",
      unit: "MXN + IVA",
    },
    {
      title: "Falla en aplicación de oficina simple",
      desc: "Solucionamos una falla de aplicación de oficina simple (una sola app, usuario único)",
      price: "800",
      unit: "MXN + IVA",
    },
    {
      title: "Falla en aplicación productiva más compleja",
      desc: "Solucionamos una falla de aplicación de más compleja (2-4 módulos, usuarios, integraciones)",
      price: "6,000",
      unit: "MXN + IVA",
    },
    {
      title: "Problema severo",
      desc: "Caídas, pérdida de datos, incompatibilidades en servidor",
      price: "11,700",
      unit: "MXN + IVA",
    },
    {
      title: "Optimización básica",
      desc: "De una computadora personal / laptop doméstica (usuario individual)",
      price: "1,000",
      unit: "MXN + IVA",
    },
    {
      title: "Optimización computadora de oficina",
      desc: "(empresa pequeña, 1-2 equipos) más software instalado y posibles conflictos",
      price: "3,800",
      unit: "MXN + IVA",
    },
    {
      title: "Optimización servidor pequeño / mediano",
      desc: "Con bases de datos leves, o sistema crítico que requiere optimización de rendimiento (configuraciones, cachés, ajustes)",
      price: "10,000",
      unit: "MXN + IVA",
    },
    {
      title:
        "Optimización servidor grande / ambientes empresariales con muchas aplicaciones",
      desc: "Mucho uso, alta demanda de rendimiento, optimización profunda de base de datos, red, almacenamiento",
      price: "18,000",
      unit: "MXN + IVA",
    },
  ],
};

export default function Page() {
  return <ServicePage data={data} />;
}