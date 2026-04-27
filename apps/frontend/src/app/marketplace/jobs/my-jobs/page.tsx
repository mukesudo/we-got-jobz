"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function MyJobsPage() {
  const { data: session, isPending } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/auth/login?callbackURL=/marketplace/jobs/my-jobs");
      return;
    }

    const fetchMyJobs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/jobs/client/${session.user.id}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [session, isPending, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/jobs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== id));
      } else {
        alert("Failed to delete job.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting job.");
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Posted Jobs</h1>
          <p className="text-muted-foreground mt-2">Manage the jobs you have posted on We Got Jobz.</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/jobs/create">
            <Plus className="mr-2 h-4 w-4" /> Post a New Job
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-lg font-medium text-slate-600 mb-4">You haven't posted any jobs yet.</p>
            <Button asChild>
              <Link href="/jobs/create">Post your first job</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Link href={`/marketplace/jobs/${job.id}`} className="hover:underline">
                        <h2 className="text-xl font-semibold text-primary">{job.title}</h2>
                      </Link>
                      <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <span>${job.budget} {job.budgetType === "HOURLY" ? "/ hr" : "(Fixed)"}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{job.bids?.length || 0} Proposals</span>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-2 justify-start md:justify-center">
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <Link href={`/marketplace/jobs/${job.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <Link href={`/jobs/edit/${job.id}`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)} className="w-full justify-start">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
