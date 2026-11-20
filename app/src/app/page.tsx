import Tracker from "./tracker";

// Server Component: renders the page shell. The tracker itself runs in the browser
// because v1 keeps its data in the browser (localStorage). See specs/v1-spec.md.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Expense Deadline Tracker</h1>
        <p className="text-sm text-zinc-500">
          See who to chase first, send a personal reminder, and keep track of follow-ups before
          expense reports auto-approve. Use initials or employee IDs only, never names. Data stays
          in this browser.
        </p>
      </header>
      <Tracker />
    </main>
  );
}
