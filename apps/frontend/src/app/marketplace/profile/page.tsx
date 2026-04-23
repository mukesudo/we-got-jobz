"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

/**
 * /marketplace/profile -> redirects to /marketplace/profile/[currentUserId]
 * This fixes the 404 when users click "Profile" in the navbar.
 */
export default function ProfileRedirectPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/auth/login?callbackURL=/marketplace/profile");
      return;
    }

    router.replace(`/marketplace/profile/${session.user.id}`);
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-3" />
        <p className="text-slate-500">Loading your profile...</p>
      </div>
    </div>
  );
}
