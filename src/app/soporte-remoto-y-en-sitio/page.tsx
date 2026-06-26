import type { Metadata } from "next";
import { ServicePage, type ServicePageData } from "@/components/service/service-page";

export const metadata: Metadata = {
  title: "Soporte Remoto y en Sitio – SafeWare",
  description:
    "Con nuestro servicio de soporte remoto y en sitio, obtienes atención experta justo cuando la necesitas.",
};

const data: ServicePageData = {
  title: "Soporte Remoto y en Sitio",
  heroSubtitle: (
    <>
      Con nuestro servicio de{" "}
      <strong className="font-bold">
        soporte remoto y en sitio
      </strong>
      , obtienes atención experta justo cuando la necesitas.
    </>
  ),
  heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop&crop=center",
  servicioHeading:
    "Tu tecnología segura y optimizada con soporte remoto y en sitio confiable.",
  servicioImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop&crop=center",
  servicioText: (
    <>
      Brindamos soluciones de{" "}
      <strong className="font-bold">
        soporte remoto y en sitio
      </strong>{" "}
      adaptadas a las necesidades de tu negocio. Atendemos problemas técnicos,
      mantenemos tus sistemas en óptimas condiciones y aseguramos que tu
      infraestructura tecnológica funcione de manera estable y segura.
    </>
  ),
  variant: "hourly",
  services: [
    {
      title:
        "Análisis y desarrollo web, configuración remota, soporte en cPanel o servidor CentOS",
      price: "600",
      unit: "MXN P/ Hora + IVA",
    },
    {
      title: "Soporte técnico para servidores Linux y Windows.",
      price: "90",
      unit: "MXN P/ Hora + IVA",
    },
    {
      title: "Soporte remoto telefónico o virtual vía TeamViewer.",
      price: "200",
      unit: "MXN P/ Hora + IVA",
    },
    {
      title: "Soporte remoto para software y hardware.",
      price: "650",
      unit: "MXN P/ Hora + IVA",
    },
    {
      title: "Soporte técnico remoto por conexión remota.",
      price: "350",
      unit: "MXN P/ Hora + IVA",
    },
    {
      title: "Soporte telefónico y remoto 24/7.",
      price: "100",
      unit: "MXN P/ Hora + IVA",
    },
  ],
};

export default function Page() {
  return <ServicePage data={data} />;
}