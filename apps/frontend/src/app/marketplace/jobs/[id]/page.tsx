import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import ProposalForm from "./proposal-form";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3000";

type JobDetails = {
  id: string;
  title: string;
  description: string;
  budget: number;
  budgetType: "FIXED" | "HOURLY";
  deadline?: string | null;
  createdAt: string;
  skills?: { id: string; name: string }[];
  bids?: { id: string; amount: number }[];
  client?: {
    id: string;
    name?: string | null;
    clientProfile?: {
      company?: string | null;
      location?: string | null;
    } | null;
  } | null;
};

const getJobDetails = async (id: string): Promise<JobDetails | null> => {
  const response = await fetch(`${BACKEND_URL}/jobs/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json();
};

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = await getJobDetails(params.id);

  if (!job) {
    notFound();
  }

  const budgetDisplay = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(job.budget);

  return (
    <div className="bg-secondary/40">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="bg-background rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <span className="font-semibold text-lg">
                {job.client?.clientProfile?.company || job.client?.name || "Client"}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    <span>
                      {budgetDisplay}
                      {job.budgetType === "HOURLY" ? " / hr" : ""}
                    </span>
                </div>
                 <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>
                      {job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : "No deadline"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    <span>{job.bids?.length ?? 0} proposals</span>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                  {job.description}
                </div>
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <div className="space-y-6">
              <ProposalForm jobId={job.id} />
              <Card>
                <CardHeader>
                  <CardTitle>About the Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                     <p className="font-semibold text-lg">{job.client?.name || "Client"}</p>
                     {job.client?.clientProfile?.location && (
                      <p className="text-sm text-muted-foreground">{job.client.clientProfile.location}</p>
                     )}
                     {job.client?.clientProfile?.company && (
                      <p className="text-sm text-muted-foreground">{job.client.clientProfile.company}</p>
                     )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
