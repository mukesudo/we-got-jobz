"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { BidsService } from "@/lib/bids.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserRole } from "@/lib";

type ProposalFormProps = {
  jobId: string;
};

export default function ProposalForm({ jobId }: ProposalFormProps) {
  const { data: sessionData, isPending } = useSession();
  const [amount, setAmount] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isPending) {
    return <div className="text-sm text-muted-foreground">Checking session...</div>;
  }

  const isAuthenticated = !!sessionData?.session;
  const currentUser = sessionData?.user as { role?: UserRole } | undefined;
  const userRole = currentUser?.role;

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border bg-background p-4">
        <p className="text-sm text-muted-foreground">
          Please sign in to submit a proposal.
        </p>
        <Button asChild className="mt-4 w-full">
          <Link href={`/auth/login?callbackURL=/marketplace/jobs/${jobId}`}>
            Sign In
          </Link>
        </Button>
      </div>
    );
  }

  if (userRole && userRole !== UserRole.FREELANCER) {
    return (
      <div className="rounded-lg border bg-background p-4">
        <p className="text-sm text-muted-foreground">
          Only freelancers can submit proposals for jobs.
        </p>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const amountValue = Number(amount);
    const hoursValue = estimatedHours.trim() === "" ? undefined : Number(estimatedHours);
    if (!amountValue || Number.isNaN(amountValue)) {
      setError("Please enter a valid bid amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      await BidsService.create({
        projectId: jobId,
        amount: amountValue,
        estimatedHours: hoursValue,
        coverLetter: coverLetter.trim(),
      });
      setSuccess(true);
      setAmount("");
      setEstimatedHours("");
      setCoverLetter("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border bg-background p-4">
      <h3 className="text-lg font-semibold">Submit a Proposal</h3>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-600">Proposal sent.</p>}
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="amount">
            Bid Amount
          </label>
          <Input
            id="amount"
            type="number"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g., 1500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="estimatedHours">
            Estimated Hours (optional)
          </label>
          <Input
            id="estimatedHours"
            type="number"
            min="0"
            value={estimatedHours}
            onChange={(event) => setEstimatedHours(event.target.value)}
            placeholder="e.g., 40"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="coverLetter">
            Cover Letter (optional)
          </label>
          <Textarea
            id="coverLetter"
            rows={4}
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
            placeholder="Introduce yourself and outline your approach..."
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Send Proposal"}
        </Button>
      </form>
    </div>
  );
}
