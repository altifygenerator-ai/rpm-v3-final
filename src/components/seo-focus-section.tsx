import { seoFocus } from "@/data/seo-focus";

export default function SeoFocusSection() {
  return (
    <section className="bg-[var(--cream)] py-20 text-[var(--forest)]">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
            {seoFocus.eyebrow}
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--forest)] md:text-5xl">
            {seoFocus.title}
          </h2>

          <p className="mt-6 text-lg text-neutral-700">
            {seoFocus.description}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {seoFocus.problems.map((problem) => (
            <div
              key={problem}
              className="rounded-2xl border border-[#d9caa8] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="font-semibold text-[var(--background)]">{problem}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
