"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function MarketTrendsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isChunkError =
    error.name === "ChunkLoadError" ||
    /Loading chunk|ChunkLoadError|Failed to fetch dynamically imported module/i.test(
      error.message,
    );

  useEffect(() => {
    console.error("[market-trends]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-lg font-semibold text-foreground">
        {isChunkError
          ? "Market trends is still loading"
          : "Could not load market trends"}
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {isChunkError
          ? "The page bundle timed out while the dev server was compiling. This often happens on the first visit—retry after a few seconds."
          : error.message}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reload page
        </Button>
      </div>
    </div>
  );
}
