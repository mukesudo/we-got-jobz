// apps/frontend/components/debug-backend.tsx
"use client";

import { useEffect, useState } from "react";

export function DebugBackend() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/health`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error(`Status ${res.status}\nUrl ${process.env.NEXT_PUBLIC_API_URL}`);
        setData(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }
    run();
  }, []);

  return (
    <pre className="text-xs">
      {error ? `Error: ${error}` : JSON.stringify(data, null, 2)}
    </pre>
  );
}
