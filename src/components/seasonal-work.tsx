import { seasonalWork } from "@/data/seasonal";

export default function SeasonalWork() {
  return (
    <section className="bg-[var(--forest)] py-20 text-white">
      <div className="container max-w-6xl mx-auto px-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        
        {/* Left */}
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
            {seasonalWork.eyebrow}
          </p>

          <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
            {seasonalWork.title}
          </h2>

          <p className="mt-6 text-white/80 text-lg">
            {seasonalWork.description}
          </p>
        </div>

        {/* Right */}
        <div className="rounded-[2rem] bg-white/10 p-6 ring-1 ring-white/15">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
            Work we’re focusing on right now
          </p>

          <div className="mt-6 grid gap-3">
            {seasonalWork.services.map((service) => (
              <div
                key={service}
                className="rounded-xl bg-white/10 px-4 py-3 font-semibold"
              >
                {service}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}