import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/get-session";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3000";

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
    skills?: { id: string; name: string }[];
  } | null;
  clientProfile?: {
    company?: string | null;
    location?: string | null;
  } | null;
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
