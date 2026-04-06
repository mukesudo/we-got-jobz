'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
            <p className="text-lg text-muted-foreground mb-8">
                The page you are looking for does not exist or has been moved.
            </p>
            <Button asChild>
                <Link href="/">Go to Homepage</Link>
            </Button>
        </div>
    );
}
