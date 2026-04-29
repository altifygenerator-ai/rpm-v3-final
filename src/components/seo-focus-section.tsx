import { seoFocus } from "@/data/seo-focus";

export default function SeoFocusSection() {
  return (
    <section className="bg-[var(--cream)] py-20">
      <div className="container max-w-6xl mx-auto px-6">
        
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">
            {seoFocus.eyebrow}
          </p>

          <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight text-[var(--forest)]">
            {seoFocus.title}
          </h2>

          <p className="mt-6 text-neutral-600 text-lg">
            {seoFocus.description}
          </p>
        </div>

        {/* Problem Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {seoFocus.problems.map((problem) => (
    <div
      key={problem}
      className="rounded-2xl border border-[var(--border)] bg-[var(--foreground)] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <p className="!text-[var(--background)] !font-semibold">
        {problem}
      </p>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}