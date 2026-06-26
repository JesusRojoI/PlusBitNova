import { SectionLabel } from "@/components/section-label";

const IMG = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80";

const reasons = [
  {
    n: "01",
    title: "Personal Especializado",
    body: "Contamos con expertos preparados para atender los retos de tu empresa.",
  },
  {
    n: "02",
    title: "Proactive Approach",
    body: "Actuamos con prevención, revisando y cuidando tus sistemas antes de que surjan fallas.",
  },
  {
    n: "04",
    title: "Medidas de seguridad robustas",
    body: "Ponemos tus datos y sistemas protegidos con soluciones seguras y confiables.",
  },
  {
    n: "03",
    title: "Soluciones y escalabilidad",
    body: "Cada empresa es diferente, por eso diseñamos soluciones que crecen con tu negocio.",
  },
];

export function PorQue() {
  return (
    <section className="bg-royal-radial py-20 sm:py-28 relative z-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Top: heading + image */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel variant="dark">¿Por qué escogernos?</SectionLabel>
            <h2 className="mt-6 max-w-md font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">
              En Safeware aplicamos un enfoque distinto a cada proyecto.
            </h2>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={IMG}
              alt="Especialistas de Safeware revisando sistemas"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {reasons.map((r) => (
            <div
              key={r.n}
              className="rounded-2xl border border-white/15 bg-card/95 p-7 backdrop-blur-sm transition-colors hover:bg-white/[0.08] sm:p-8"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <span className="font-display text-sm font-bold text-white/80">
                  {r.n}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-primary sm:text-2xl">
                {r.title}
              </h3>
              <div className="mt-4 h-px w-full bg-white/20" />
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                {r.body}
              </p>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <p className="mx-auto mt-16 max-w-4xl text-center font-display text-2xl font-medium leading-snug text-white sm:text-[2rem]">
          Compartimos nuestra experiencia y compromiso en cada proyecto para
          construir relaciones duraderas basadas en confianza. Te acompañamos
          en todo el ciclo de vida para lograr resultados reales.
        </p>
      </div>

      {/* === CAPA NEGRA PARA ELIMINAR LA DIAGONAL === */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black -mb-8 pointer-events-none"></div>
    </section>
  );
}