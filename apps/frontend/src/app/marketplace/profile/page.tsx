"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { UserRole } from "@/lib";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal";

export default function ProfileSettingsPage() {
  const { data: sessionData, isPending } = useSession();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [freelancerForm, setFreelancerForm] = useState({
    title: "",
    hourlyRate: "",
    bio: "",
    skills: "",
  });

  const [clientForm, setClientForm] = useState({
    company: "",
    location: "",
  });

  const status = isPending ? "loading" : (sessionData?.session ? "authenticated" : "unauthenticated");
  const userRole = (sessionData?.user as any)?.role as UserRole | undefined;
  const userId = sessionData?.user?.id;

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowLoginModal(true);
      return;
    }
    if (status !== "authenticated" || !userId || !userRole) return;

    const fetchProfile = async () => {
      try {
        if (userRole === UserRole.FREELANCER) {
          const response = await api.get(`/talent/${userId}`);
          const profile = response.data?.freelancerProfile;
          setFreelancerForm({
            title: profile?.title || "",
            hourlyRate: profile?.hourlyRate ? String(profile.hourlyRate) : "",
            bio: profile?.bio || "",
            skills: (profile?.skills || []).map((skill: { name: string }) => skill.name).join(", "),
          });
        } else if (userRole === UserRole.CLIENT) {
          const response = await api.get(`/profiles/${userId}`);
          const profile = response.data?.clientProfile;
          setClientForm({
            company: profile?.company || "",
            location: profile?.location || "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [status, userId, userRole]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "authenticated") {
      setShowLoginModal(true);
      return;
    }
    if (!userRole || userRole === UserRole.ADMIN) {
      setError("This profile type is not supported yet.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (userRole === UserRole.FREELANCER) {
        const skills = freelancerForm.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
        await api.post("/profiles/freelancer", {
          title: freelancerForm.title,
          hourlyRate: freelancerForm.hourlyRate ? Number(freelancerForm.hourlyRate) : undefined,
          bio: freelancerForm.bio,
          skills,
        });
      } else if (userRole === UserRole.CLIENT) {
        await api.post("/profiles/client", {
          company: clientForm.company,
          location: clientForm.location,
        });
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="bg-secondary/40 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Update Profile</CardTitle>
            <CardDescription>Keep your information up to date for better matches.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                Profile updated successfully.
              </div>
            )}
            {userRole === UserRole.FREELANCER && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={freelancerForm.title}
                    onChange={(e) => setFreelancerForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Senior React Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    value={freelancerForm.hourlyRate}
                    onChange={(e) => setFreelancerForm((prev) => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="e.g., 75"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={5}
                    value={freelancerForm.bio}
                    onChange={(e) => setFreelancerForm((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Share a short intro about your experience."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    value={freelancerForm.skills}
                    onChange={(e) => setFreelancerForm((prev) => ({ ...prev, skills: e.target.value }))}
                    placeholder="React, Node.js, Prisma"
                  />
                  <p className="text-xs text-muted-foreground">Separate skills with a comma.</p>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}

            {userRole === UserRole.CLIENT && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={clientForm.company}
                    onChange={(e) => setClientForm((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g., Acme Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={clientForm.location}
                    onChange={(e) => setClientForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., New York, NY"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal open={showLoginModal} onOpenChange={setShowLoginModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Authentication Required</ModalTitle>
            <ModalDescription>
              You must be logged in to update your profile. Please log in to continue.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowLoginModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => router.push("/auth/login")}>Log In</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
