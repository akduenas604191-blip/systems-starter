import ProblemList from "./problem-list";
import { sampleProblems } from "@/lib/problems";

// Server Component: later this is where problems get loaded from Supabase.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">Problems</h1>
      <ProblemList problems={sampleProblems} />
    </main>
  );
}
