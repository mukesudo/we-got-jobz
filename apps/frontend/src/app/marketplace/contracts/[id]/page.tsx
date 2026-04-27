"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, use } from "react";
import { useSession } from "@/lib/auth-client";
import { ContractsService } from "@/lib/contracts.service";
import {
  MilestonesService,
  type Milestone,
  type MilestoneStatus,
} from "@/lib/milestones.service";
import type { Contract } from "@/lib";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  PlusCircle,
  ShieldCheck,
  Upload,
  XCircle,
  AlertCircle,
} from "lucide-react";

const statusBadge: Record<MilestoneStatus, { label: string; tone: string }> = {
  PENDING: { label: "Awaiting funding / submission", tone: "bg-slate-100 text-slate-700" },
  IN_REVIEW: { label: "In review", tone: "bg-blue-100 text-blue-700" },
  APPROVED: { label: "Approved", tone: "bg-emerald-100 text-emerald-700" },
  RELEASED: { label: "Paid out", tone: "bg-emerald-600 text-white" },
  REJECTED: { label: "Revisions requested", tone: "bg-amber-100 text-amber-800" },
};

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = (session?.user as any)?.role as
    | "CLIENT"
    | "FREELANCER"
    | "ADMIN"
    | undefined;

  const [contract, setContract] = useState<Contract | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Forms
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    amount: "",
    dueDate: "",
  });

  const [submittingFor, setSubmittingFor] = useState<string | null>(null);
  const [submitForm, setSubmitForm] = useState({ note: "", url: "" });

  const isClient = contract?.clientId === userId;
  const isFreelancer = contract?.freelancerId === userId;

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [c, m] = await Promise.all([
        ContractsService.getOne(id),
        MilestonesService.list(id),
      ]);
      setContract(c);
      setMilestones(m);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load contract");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const totals = useMemo(() => {
    const total = milestones.reduce((s, m) => s + m.amount, 0);
    const funded = milestones
      .filter((m) => m.fundedAt)
      .reduce((s, m) => s + m.amount, 0);
    const released = milestones
      .filter((m) => m.status === "RELEASED")
      .reduce((s, m) => s + m.amount, 0);
    return { total, funded, released, remaining: total - released };
  }, [milestones]);

  const runAction = async (key: string, action: () => Promise<unknown>) => {
    setActionLoading(key);
    setError(null);
    try {
      await action();
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(newMilestone.amount);
    if (!newMilestone.title.trim() || !amount || amount <= 0) {
      setError("Title and a positive amount are required.");
      return;
    }
    await runAction("create", async () => {
      await MilestonesService.create(id, {
        title: newMilestone.title.trim(),
        description: newMilestone.description.trim() || undefined,
        amount,
        dueDate: newMilestone.dueDate || undefined,
      });
      setNewMilestone({ title: "", description: "", amount: "", dueDate: "" });
      setShowCreateForm(false);
    });
  };

  const handleSubmitDeliverable = async (
    e: React.FormEvent,
    milestoneId: string,
  ) => {
    e.preventDefault();
    if (!submitForm.note.trim()) {
      setError("Please describe the deliverable.");
      return;
    }
    await runAction("submit-" + milestoneId, async () => {
      await MilestonesService.submit(milestoneId, {
        submissionNote: submitForm.note.trim(),
        submissionUrl: submitForm.url.trim() || undefined,
      });
      setSubmitForm({ note: "", url: "" });
      setSubmittingFor(null);
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading contract...</div>;
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">{error || "Contract not found"}</p>
        <Link href="/marketplace/contracts" className="text-primary hover:underline mt-4 inline-block">
          ← Back to contracts
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link
        href="/marketplace/contracts"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to contracts
      </Link>

      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{contract.status}</Badge>
              <span className="text-xs text-slate-500">
                Started {new Date(contract.startedAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {contract.project?.title || "Untitled project"}
            </h1>
            <div className="mt-2 text-sm text-slate-500">
              {isClient ? "Hired " : "Working with "}
              <span className="font-medium text-slate-700">
                {isClient ? contract.freelancer?.name : contract.client?.name}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Contract value
            </p>
            <p className="text-3xl font-bold text-slate-900">
              ${contract.amount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile
            icon={<DollarSign className="h-4 w-4" />}
            label="Milestones total"
            value={`$${totals.total.toLocaleString()}`}
            tone="blue"
          />
          <StatTile
            icon={<ShieldCheck className="h-4 w-4" />}
            label="In escrow"
            value={`$${(totals.funded - totals.released).toLocaleString()}`}
            tone="violet"
          />
          <StatTile
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Released"
            value={`$${totals.released.toLocaleString()}`}
            tone="emerald"
          />
          <StatTile
            icon={<Clock className="h-4 w-4" />}
            label="Remaining"
            value={`$${totals.remaining.toLocaleString()}`}
            tone="amber"
          />
        </div>

        {contract.project?.id && (
          <div className="mt-4">
            <Link
              href={`/marketplace/jobs/${contract.project.id}`}
              className="inline-flex items-center text-sm text-blue-600 hover:underline"
            >
              View original job <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        )}
      </Card>

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Milestones & Deliverables</h2>
        {isClient && contract.status === "ACTIVE" && (
          <Button onClick={() => setShowCreateForm((v) => !v)} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            {showCreateForm ? "Cancel" : "Add milestone"}
          </Button>
        )}
      </div>

      {showCreateForm && isClient && (
        <Card className="p-5 mb-4">
          <form onSubmit={handleCreateMilestone} className="space-y-4">
            <div>
              <Label htmlFor="m-title">Title</Label>
              <Input
                id="m-title"
                value={newMilestone.title}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, title: e.target.value })
                }
                placeholder="e.g. Initial wireframes"
              />
            </div>
            <div>
              <Label htmlFor="m-desc">Description</Label>
              <Textarea
                id="m-desc"
                rows={3}
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    description: e.target.value,
                  })
                }
                placeholder="What needs to be delivered?"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="m-amount">Amount ($)</Label>
                <Input
                  id="m-amount"
                  type="number"
                  min="0"
                  value={newMilestone.amount}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="m-due">Due date (optional)</Label>
                <Input
                  id="m-due"
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading === "create"}>
                {actionLoading === "create" ? "Creating..." : "Create milestone"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {milestones.length === 0 ? (
        <Card className="p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-medium text-slate-700">No milestones yet</p>
          <p className="mt-1 text-sm text-slate-500">
            {isClient
              ? "Break this project into milestones, fund each one to escrow, and release on approval."
              : "Your client hasn't added any milestones yet."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {milestones.map((m) => {
            const badge = statusBadge[m.status];
            const canFund =
              isClient && !m.fundedAt && contract.status === "ACTIVE";
            const canSubmit =
              isFreelancer &&
              !!m.fundedAt &&
              ["PENDING", "REJECTED"].includes(m.status) &&
              contract.status === "ACTIVE";
            const canApprove =
              isClient &&
              m.status === "IN_REVIEW" &&
              !!m.submittedAt &&
              contract.status === "ACTIVE";

            return (
              <Card key={m.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{m.title}</h3>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.tone}`}
                      >
                        {badge.label}
                      </span>
                      {m.fundedAt && m.status !== "RELEASED" && (
                        <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="h-3 w-3 mr-1" /> Funded
                        </span>
                      )}
                    </div>
                    {m.description && (
                      <p className="text-sm text-slate-600 mt-1.5">
                        {m.description}
                      </p>
                    )}
                    {m.dueDate && (
                      <p className="text-xs text-slate-500 mt-1">
                        Due {new Date(m.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      ${m.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {m.submittedAt && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-slate-700">
                      Submitted{" "}
                      {new Date(m.submittedAt).toLocaleString()}
                    </p>
                    {m.submissionNote && (
                      <p className="mt-1 text-slate-600 whitespace-pre-wrap">
                        {m.submissionNote}
                      </p>
                    )}
                    {m.submissionUrl && (
                      <a
                        href={m.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-blue-600 hover:underline"
                      >
                        View deliverable <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}

                {m.status === "REJECTED" && m.rejectedReason && (
                  <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                    <p className="font-medium">Revisions requested:</p>
                    <p className="mt-0.5">{m.rejectedReason}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {canFund && (
                    <Button
                      size="sm"
                      onClick={() =>
                        runAction("fund-" + m.id, () =>
                          MilestonesService.fund(m.id),
                        )
                      }
                      disabled={actionLoading === "fund-" + m.id}
                    >
                      <ShieldCheck className="h-4 w-4 mr-1.5" />
                      {actionLoading === "fund-" + m.id
                        ? "Funding escrow..."
                        : `Fund $${m.amount} to escrow`}
                    </Button>
                  )}

                  {canSubmit && (
                    <Button
                      size="sm"
                      variant={submittingFor === m.id ? "outline" : "default"}
                      onClick={() => {
                        setSubmittingFor(submittingFor === m.id ? null : m.id);
                        setSubmitForm({ note: "", url: "" });
                      }}
                    >
                      <Upload className="h-4 w-4 mr-1.5" />
                      {submittingFor === m.id ? "Cancel" : "Submit deliverable"}
                    </Button>
                  )}

                  {canApprove && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          runAction("approve-" + m.id, () =>
                            MilestonesService.approve(m.id),
                          )
                        }
                        disabled={actionLoading === "approve-" + m.id}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        {actionLoading === "approve-" + m.id
                          ? "Releasing..."
                          : "Approve & release"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const reason = window.prompt(
                            "What revisions are needed?",
                          );
                          if (reason !== null) {
                            runAction("reject-" + m.id, () =>
                              MilestonesService.reject(m.id, reason),
                            );
                          }
                        }}
                        disabled={actionLoading === "reject-" + m.id}
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Request revisions
                      </Button>
                    </>
                  )}
                </div>

                {submittingFor === m.id && canSubmit && (
                  <form
                    onSubmit={(e) => handleSubmitDeliverable(e, m.id)}
                    className="mt-4 space-y-3 rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <Label htmlFor={`note-${m.id}`}>Submission notes</Label>
                      <Textarea
                        id={`note-${m.id}`}
                        rows={3}
                        value={submitForm.note}
                        onChange={(e) =>
                          setSubmitForm({ ...submitForm, note: e.target.value })
                        }
                        placeholder="Describe what you're delivering and any context..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`url-${m.id}`}>Deliverable URL (optional)</Label>
                      <Input
                        id={`url-${m.id}`}
                        type="url"
                        value={submitForm.url}
                        onChange={(e) =>
                          setSubmitForm({ ...submitForm, url: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSubmittingFor(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={actionLoading === "submit-" + m.id}
                      >
                        {actionLoading === "submit-" + m.id
                          ? "Submitting..."
                          : "Submit for review"}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "blue" | "violet" | "emerald" | "amber";
}) {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  } as const;
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div
        className={`inline-flex items-center justify-center w-7 h-7 rounded-md mb-2 ${toneClasses[tone]}`}
      >
        {icon}
      </div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
