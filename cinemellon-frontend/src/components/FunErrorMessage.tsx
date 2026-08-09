import { FunError } from "@/content/funErrors";

export default function FunErrorMessage({ error, compact = false }: { error: FunError; compact?: boolean }) {
  if (compact) {
    return (
      <p className="px-5 py-4 text-sm text-coral">
        <span className="font-semibold">Error {error.code}</span> — {error.message}
      </p>
    );
  }

  return (
    <div className="text-center">
      <p className="font-display text-3xl text-coral">Error {error.code}</p>
      <p className="mt-2 text-sm text-muted sm:text-base">{error.message}</p>
    </div>
  );
}
