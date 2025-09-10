import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-950 to-emerald-900 text-emerald-50 flex items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-2xl border border-emerald-800 bg-emerald-900/60 shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-300 to-lime-300 bg-clip-text text-transparent">
            THIRD SEMESTER FINAL BOSS
          </span>
        </h1>
        <p className="mt-2 text-sm text-emerald-200">Testing doang</p>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-5xl font-extrabold tabular-nums">{count}</span>
          <span className="text-emerald-300">points</span>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <button
            className="col-span-1 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.99] transition"
            onClick={() => setCount((prev) => prev + 1)}
            aria-label="Increment"
          >
            Increment
          </button>
          <button
            className="col-span-1 inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.99] transition"
            onClick={() => setCount((prev) => prev - 1)}
            aria-label="Decrement"
          >
            Decrement
          </button>
          <button
            className="col-span-1 inline-flex items-center justify-center rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.99] transition"
            onClick={() => setCount(0)}
            aria-label="Reset"
          >
            Reset
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
