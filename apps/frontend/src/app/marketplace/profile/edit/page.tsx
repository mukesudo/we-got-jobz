"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function EditProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    title: "",
    hourlyRate: "",
    skills: "",
    company: "",
    location: "",
  });

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/auth/login?callbackURL=/marketplace/profile/edit");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/profiles/${session.user.id}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            bio: data.freelancerProfile?.bio || "",
            title: data.freelancerProfile?.title || "",
            hourlyRate: data.freelancerProfile?.hourlyRate?.toString() || "",
            skills: data.freelancerProfile?.skills?.map((s: any) => s.name).join(", ") || "",
            company: data.clientProfile?.company || "",
            location: data.clientProfile?.location || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // We assume session.user.role is either CLIENT or FREELANCER
      const role = (session?.user as any)?.role;
      const endpoint = role === "CLIENT" ? "/api/profiles/client" : "/api/profiles/freelancer";
      
      let payload: any = {};
      
      if (role === "CLIENT") {
        payload = {
          company: formData.company,
          location: formData.location,
        };
      } else {
        payload = {
          title: formData.title,
          bio: formData.bio,
          hourlyRate: Number(formData.hourlyRate) || undefined,
          skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        };
      }

      // We need to fetch with credentials because we use Session guard
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // In nextjs better auth we might need to rely on cookies or bearer
        // better-auth uses fetch with credentials
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      router.push(`/marketplace/profile/${session?.user.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const role = (session?.user as any)?.role;

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
          <CardDescription>Update your public profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                disabled // Cannot change name from profile easily without auth api
                value={formData.name}
              />
            </div>

            {role === "FREELANCER" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    placeholder="e.g. 50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={5}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell clients about your experience and expertise..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="React, TypeScript, Node.js (comma separated)"
                  />
                  <p className="text-xs text-muted-foreground">Separate skills with commas.</p>
                </div>
              </>
            )}

            {role === "CLIENT" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your Company Inc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
