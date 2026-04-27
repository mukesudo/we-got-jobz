import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Edit, Star, Briefcase, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/get-session";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3000";

type ContractStub = {
  id: string;
  amount: number;
  endedAt: string;
  project?: { id: string; title: string; description?: string | null } | null;
  client?: { id: string; name?: string | null; image?: string | null } | null;
};

type ReviewStub = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  reviewer?: { id: string; name?: string | null; image?: string | null };
  contract?: { id: string; project?: { id: string; title: string } | null } | null;
};

type UserProfile = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: "CLIENT" | "FREELANCER" | "ADMIN";
  freelancerProfile?: {
    title?: string | null;
    bio?: string | null;
    hourlyRate?: number | null;
    rating?: number | null;
    totalReviews?: number | null;
    skills?: { id: string; name: string }[];
  } | null;
  clientProfile?: {
    company?: string | null;
    location?: string | null;
  } | null;
  completedContracts?: ContractStub[];
  reviews?: ReviewStub[];
};

const safeJson = async <T,>(response: Response): Promise<T | null> => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

async function fetchProfile(id: string): Promise<UserProfile | null> {
  const freelancerResponse = await fetch(`${BACKEND_URL}/api/talent/${id}`, {
    cache: "no-store",
  });
  if (freelancerResponse.ok) {
    const data = await safeJson<UserProfile>(freelancerResponse);
    if (data) return data;
  }

  const response = await fetch(`${BACKEND_URL}/api/profiles/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;
  return safeJson<UserProfile>(response);
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await params;

  const [user, session] = await Promise.all([
    fetchProfile(id),
    getSession(),
  ]);

  if (!user) {
    notFound();
  }

  const isSelf = session?.user?.id === user.id;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{user.name || "Unnamed User"}</h1>
              {user.freelancerProfile?.title && (
                <p className="text-lg text-muted-foreground">{user.freelancerProfile.title}</p>
              )}
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" /> {user.email}
              </div>
              {user.role === "FREELANCER" && (user.freelancerProfile?.rating ?? 0) > 0 && (
                <div className="flex items-center mt-2 gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${
                        n <= (user.freelancerProfile?.rating ?? 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    {user.freelancerProfile?.rating} ({user.freelancerProfile?.totalReviews ?? 0} review{user.freelancerProfile?.totalReviews === 1 ? "" : "s"})
                  </span>
                </div>
              )}
            </div>
          </div>
          {isSelf && (
            <Link
              href="/marketplace/profile/edit"
              className="mt-4 md:mt-0 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Link>
          )}
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-muted-foreground leading-relaxed">
            {user.freelancerProfile?.bio ||
              user.clientProfile?.company ||
              "No bio provided yet."}
          </p>
        </div>

        {user.role === "FREELANCER" && (
          <>
            <Separator className="my-8" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(user.freelancerProfile?.skills || []).map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
              {user.freelancerProfile?.hourlyRate ? (
                <p className="mt-4 text-lg font-semibold">
                  ${user.freelancerProfile.hourlyRate}/hr
                </p>
              ) : null}
            </div>

            {/* Work History */}
            <Separator className="my-8" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Work History</h2>
              {(user.completedContracts || []).length === 0 ? (
                <p className="text-muted-foreground">No completed projects yet.</p>
              ) : (
                <div className="space-y-3">
                  {(user.completedContracts || []).map((c) => (
                    <Card key={c.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-emerald-50 text-emerald-600">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <div>
                            <Link
                              href={`/marketplace/contracts/${c.id}`}
                              className="font-semibold text-slate-900 hover:underline"
                            >
                              {c.project?.title || "Untitled project"}
                            </Link>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="inline-flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Completed {new Date(c.endedAt).toLocaleDateString()}
                              </span>
                              <span>${c.amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <Separator className="my-8" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              {(user.reviews || []).length === 0 ? (
                <p className="text-muted-foreground">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {(user.reviews || []).map((r) => (
                    <Card key={r.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                            {r.reviewer?.image ? (
                              <img
                                src={r.reviewer.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                                {r.reviewer?.name?.charAt(0) || "U"}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {r.reviewer?.name || "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(r.createdAt).toLocaleDateString()}
                              {r.contract?.project?.title && (
                                <> · <Link href={`/marketplace/contracts/${r.contract.id}`} className="hover:underline">{r.contract.project.title}</Link></>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className={`h-4 w-4 ${
                                n <= r.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                          {r.comment}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {user.role === "CLIENT" && (
          <>
            <Separator className="my-8" />
            <div className="space-y-2 text-muted-foreground">
              {user.clientProfile?.company && <p>Company: {user.clientProfile.company}</p>}
              {user.clientProfile?.location && <p>Location: {user.clientProfile.location}</p>}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
