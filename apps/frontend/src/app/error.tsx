"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-lg text-muted-foreground mb-8">{error.message || "An unexpected error occurred."}</p>
            <div className="flex gap-4">
                <Button onClick={reset}>Try again</Button>
                <Button variant="outline" asChild>
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </div>
        </div>
    );
}