export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
      <p className="mb-4 text-sm lowercase tracking-[0.2em] text-[var(--omniray-mist)]">
        omniray software solutions
      </p>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
        software that sees <span className="text-[var(--omniray-coral)]">everything</span> your
        business needs.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--omniray-mist)]">
        we design and build web and software products, from first idea to launch.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#contact"
          className="rounded-full bg-[var(--omniray-coral)] px-6 py-3 font-semibold lowercase text-[var(--omniray-blue)] transition hover:brightness-110"
        >
          start a project
        </a>
        <a
          href="#work"
          className="rounded-full border border-white/20 px-6 py-3 font-semibold lowercase transition hover:bg-white/10"
        >
          see our work
        </a>
      </div>
    </main>
  );
}
