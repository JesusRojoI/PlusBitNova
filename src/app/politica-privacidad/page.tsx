// src/app/terminos-condiciones/page.tsx
'use client';

import { Shield, Lock, FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TerminosCondicionesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Última actualización: {new Date().toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-blue-200 text-sm mt-2">
            Versión 2.1 - PlusBitNova Seguridad Digital
          </p>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Tarjeta 1: Introducción */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  1. Introducción y Aceptación
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Bienvenido a <strong>PlusBitNova</strong> (en adelante, "la Empresa", "nosotros", "nuestro" o "PlusBitNova"). 
                  Estos Términos y Condiciones (en adelante, "Términos") regulan el acceso y uso de nuestro sitio web 
                  <span className="text-blue-600"> plusbitnova.com</span>, así como todos los servicios, productos, 
                  contenidos y funcionalidades ofrecidos a través del mismo.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Al acceder, navegar o utilizar nuestros servicios, usted (en adelante, "el Usuario", "el Cliente" 
                  o "usted") acepta quedar vinculado por estos Términos en su totalidad. Si no está de acuerdo con 
                  alguna parte de estos Términos, le rogamos que no utilice nuestros servicios.
                </p>
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      <strong>Importante:</strong> Estos Términos constituyen un acuerdo legal vinculante entre usted 
                      y PlusBitNova. Lea atentamente todas las secciones antes de contratar nuestros servicios.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Servicios */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  2. Descripción de Servicios
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  PlusBitNova ofrece servicios especializados en <strong>ciberseguridad</strong>, incluyendo pero no 
                  limitado a:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3 text-gray-700">
                  <li>
                    <strong>Auditorías de Seguridad:</strong> Evaluación integral de infraestructura tecnológica, 
                    incluyendo pruebas de penetración, análisis de vulnerabilidades y hardening de sistemas.
                  </li>
                  <li>
                    <strong>Protección de Datos:</strong> Implementación de soluciones de cifrado, gestión de 
                    identidades y accesos (IAM), y cumplimiento normativo (GDPR, LFPDPPP).
                  </li>
                  <li>
                    <strong>Monitoreo 24/7:</strong> Servicios de SOC (Security Operations Center) con detección 
                    y respuesta a incidentes en tiempo real.
                  </li>
                  <li>
                    <strong>Capacitación:</strong> Programas de concientización y formación en ciberseguridad 
                    para equipos de trabajo.
                  </li>
                  <li>
                    <strong>Consultoría Estratégica:</strong> Asesoramiento en arquitectura de seguridad, 
                    gestión de riesgos y continuidad de negocio.
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Los servicios específicos contratados por el Usuario se detallarán en la cotización o propuesta 
                  comercial correspondiente, la cual forma parte integral de estos Términos.
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Obligaciones */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  3. Obligaciones del Usuario
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Como Usuario de nuestros servicios, usted se compromete a:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3 text-gray-700">
                  <li>
                    <strong>Veracidad de la Información:</strong> Proporcionar datos veraces, precisos y 
                    actualizados durante el registro y contratación de servicios.
                  </li>
                  <li>
                    <strong>Uso Responsable:</strong> Utilizar nuestros servicios de manera ética y conforme a la ley, 
                    absteniéndose de actividades ilegales, fraudulentas o que puedan comprometer la seguridad de 
                    nuestras plataformas.
                  </li>
                  <li>
                    <strong>Confidencialidad:</strong> Mantener la confidencialidad de sus credenciales de acceso 
                    y notificar inmediatamente cualquier uso no autorizado de su cuenta.
                  </li>
                  <li>
                    <strong>Colaboración:</strong> Proporcionar acceso y cooperación necesaria para la ejecución 
                    de los servicios contratados, incluyendo información, sistemas y personal autorizado.
                  </li>
                  <li>
                    <strong>Puntualidad en Pagos:</strong> Realizar los pagos correspondientes en los plazos 
                    establecidos en la cotización o factura.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tarjeta 4: Propiedad Intelectual */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              4. Propiedad Intelectual
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Todo el contenido de este sitio web, incluyendo pero no limitado a textos, gráficos, logotipos, 
              iconos, imágenes, clips de audio, descargas digitales, compilaciones de datos y software, es 
              propiedad de PlusBitNova o de sus proveedores de contenido y está protegido por las leyes de 
              propiedad intelectual aplicables.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Los Usuarios no podrán reproducir, distribuir, modificar, crear obras derivadas, mostrar públicamente, 
              o explotar comercialmente ningún contenido de nuestro sitio sin el consentimiento expreso por escrito 
              de PlusBitNova. Las metodologías, herramientas y técnicas de seguridad desarrolladas por PlusBitNova 
              son propiedad intelectual exclusiva de la Empresa.
            </p>
          </div>

          {/* Tarjeta 5: Limitación de Responsabilidad */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              5. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-700 leading-relaxed">
              PlusBitNova proporciona sus servicios "tal cual" y "según disponibilidad". Si bien nos esforzamos 
              por mantener altos estándares de calidad y seguridad, no podemos garantizar que nuestros servicios 
              estén libres de errores, interrupciones o vulnerabilidades.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800 font-semibold">
                    Exención de responsabilidad:
                  </p>
                  <p className="text-sm text-yellow-700">
                    En ningún caso PlusBitNova será responsable por daños directos, indirectos, incidentales, 
                    especiales, consecuentes o punitivos que surjan del uso o imposibilidad de uso de nuestros 
                    servicios, incluso si se ha informado de la posibilidad de dichos daños.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-3">
              La responsabilidad total de PlusBitNova frente al Usuario por cualquier reclamación relacionada 
              con nuestros servicios se limitará al monto total pagado por el Usuario por los servicios en los 
              últimos seis (6) meses. Esta limitación aplica en la máxima medida permitida por la ley aplicable.
            </p>
          </div>

          {/* Tarjeta 6: Política de Privacidad */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              6. Política de Privacidad y Protección de Datos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En PlusBitNova, la protección de sus datos personales es una prioridad. Recopilamos, procesamos 
              y almacenamos sus datos de acuerdo con la <strong>Ley Federal de Protección de Datos Personales 
              en Posesión de los Particulares (LFPDPPP)</strong> en México y el <strong>Reglamento General de 
              Protección de Datos (GDPR)</strong> de la Unión Europea cuando sea aplicable.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Sus datos serán utilizados exclusivamente para la prestación de los servicios contratados, 
              facturación, atención al cliente y envío de comunicaciones relacionadas con su cuenta. 
              No compartiremos sus datos personales con terceros sin su consentimiento expreso, excepto 
              cuando sea requerido por ley o necesario para la prestación de los servicios (ej. procesadores 
              de pago, plataformas de correo).
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos 
              personales en cualquier momento, enviando una solicitud a <span className="text-blue-600">
              gestion@plusbitnova.com</span>. Para más información, consulte nuestra 
              <Link href="/politica-privacidad" className="text-blue-600 hover:underline ml-1">
                Política de Privacidad completa
              </Link>.
            </p>
          </div>

          {/* Tarjeta 7: Facturación y Pagos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              7. Facturación, Pagos y Cancelaciones
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Métodos de Pago:</strong> Aceptamos pagos mediante tarjetas de crédito/débito 
                (Visa, Mastercard, American Express), transferencias bancarias y depósitos en efectivo 
                a través de nuestra pasarela de pago segura.
              </li>
              <li>
                <strong>Facturación:</strong> Todos los precios son en Pesos Mexicanos (MXN) e incluyen 
                el IVA correspondiente (16%). Las facturas se emiten en formato CFDI 4.0 y se envían 
                al correo electrónico proporcionado por el Usuario.
              </li>
              <li>
                <strong>Plazos de Pago:</strong> Los servicios se facturan de forma anticipada. El Usuario 
                debe realizar el pago dentro de los plazos establecidos en la cotización para activar o 
                mantener los servicios contratados.
              </li>
              <li>
                <strong>Cancelaciones:</strong> El Usuario puede cancelar servicios suscritos con un 
                preaviso mínimo de 15 días hábiles. Los pagos ya realizados no son reembolsables, 
                excepto en casos de incumplimiento comprobado por parte de PlusBitNova.
              </li>
              <li>
                <strong>Renovaciones:</strong> Los servicios de suscripción se renovarán automáticamente 
                al finalizar cada período, a menos que el Usuario notifique su cancelación con la antelación 
                requerida.
              </li>
            </ul>
          </div>

          {/* Tarjeta 8: Ley Aplicable */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              8. Ley Aplicable y Jurisdicción
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Estos Términos se rigen e interpretan de acuerdo con las leyes de los <strong>Estados Unidos 
              Mexicanos</strong>. Cualquier disputa que surja en relación con estos Términos o los servicios 
              prestados por PlusBitNova será sometida a la jurisdicción exclusiva de los tribunales de la 
              <strong>Ciudad de México</strong>, renunciando las partes a cualquier otra jurisdicción que 
              pudiera corresponderles.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              En caso de que alguna disposición de estos Términos sea considerada inválida o inaplicable por 
              un tribunal competente, dicha disposición se interpretará en la medida permitida por la ley, y 
              el resto de los Términos permanecerán en pleno vigor y efecto.
            </p>
          </div>

          {/* Tarjeta 9: Contacto */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              📬 Contacto y Aceptación
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Si tiene alguna pregunta, comentario o inquietud sobre estos Términos y Condiciones, 
              no dude en contactarnos:
            </p>
            <div className="mt-4 space-y-2 text-gray-700">
              <p>📧 <strong>Email:</strong> <a href="mailto:gestion@plusbitnova.com" className="text-blue-600 hover:underline">gestion@plusbitnova.com</a></p>
              <p>🌐 <strong>Web:</strong> <a href="https://plusbitnova.com" className="text-blue-600 hover:underline">plusbitnova.com</a></p>
              <p>📍 <strong>Dirección:</strong> Ciudad de México, México</p>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600">
                <strong>Confirmación de aceptación:</strong> Al utilizar nuestros servicios, el Usuario 
                confirma que ha leído, entendido y acepta todos los términos aquí establecidos. 
                Estos Términos pueden ser actualizados periódicamente; la versión más reciente estará 
                siempre disponible en este sitio web.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Última revisión: {new Date().toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
          <p>© {new Date().getFullYear()} PlusBitNova - Seguridad Digital. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <span>•</span>
            <Link href="/politica-privacidad" className="hover:text-blue-600 transition-colors">Política de Privacidad</Link>
            <span>•</span>
            <Link href="/terminos-condiciones" className="text-blue-600">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </div>
  );
}