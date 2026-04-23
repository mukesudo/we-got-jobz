"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Briefcase, Code, ArrowRight, Loader2 } from "lucide-react";

function SelectRoleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [selected, setSelected] = React.useState<"CLIENT" | "FREELANCER" | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const callbackURL = searchParams.get("callbackURL") || "/marketplace/jobs";

  React.useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/login");
    }
  }, [isPending, session, router]);

  // If user already has a non-default role set, skip this page
  React.useEffect(() => {
    if (session?.user && (session.user as any).role && (session.user as any).role !== "CLIENT") {
      // They already chose a role previously
      // We only show this for fresh social signups
    }
  }, [session]);

  const handleSubmit = async () => {
    if (!selected || !session?.user) return;

    setIsSubmitting(true);
    setError("");

    try {
      await api.patch("/users/me", { role: selected });
      router.push(callbackURL);
    } catch (err) {
      console.error(err);
      setError("Failed to set your role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-6">
            <Briefcase className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Welcome to We Got Jobz! 🎉
          </h1>
          <p className="text-lg text-slate-500">
            One last step — tell us how you&apos;d like to use the platform.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Client Card */}
          <button
            type="button"
            onClick={() => setSelected("CLIENT")}
            className={`group relative text-left p-8 rounded-2xl border-2 transition-all duration-200 ${
              selected === "CLIENT"
                ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
            }`}
          >
            {selected === "CLIENT" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 transition-colors ${
              selected === "CLIENT"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
            }`}>
              <Briefcase className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Client</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              I want to hire talented freelancers for my projects.
            </p>

            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Post jobs & projects
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Review proposals & bids
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Manage contracts & payments
              </li>
            </ul>
          </button>

          {/* Freelancer Card */}
          <button
            type="button"
            onClick={() => setSelected("FREELANCER")}
            className={`group relative text-left p-8 rounded-2xl border-2 transition-all duration-200 ${
              selected === "FREELANCER"
                ? "border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-100"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
            }`}
          >
            {selected === "FREELANCER" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 transition-colors ${
              selected === "FREELANCER"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
            }`}>
              <Code className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Freelancer</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              I want to find work and offer my professional services.
            </p>

            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Browse & apply to jobs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Build your portfolio
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Get paid securely
              </li>
            </ul>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!selected || isSubmitting}
            className={`inline-flex items-center justify-center h-14 px-10 rounded-xl text-base font-semibold transition-all duration-200 ${
              selected
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Setting up your account...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>

          <p className="mt-4 text-sm text-slate-400">
            You can change this later in your settings.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SelectRolePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SelectRoleContent />
    </Suspense>
  );
}
