"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { JobsService } from "@/lib/jobs.service";
import { UserRole } from "@/lib";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post a Job',
  description: 'Post a job on We Got Jobz and connect with top-rated freelancers worldwide. Describe your project, set your budget, and start receiving proposals from verified talent.',
  keywords: [
    'post a job',
    'create job posting',
    'hire freelancers',
    'post freelance project',
    'find talent',
    'job posting platform',
    'hire remote workers',
    'post contract work',
    'freelance job board'
  ],
  robots: {
    index: false,
    follow: true,
  },
};

export default function CreateJobPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        budgetType: "FIXED",
        deadline: "",
        skills: [] as string[],
    });
    const [skillInput, setSkillInput] = useState("");
    const { data: sessionData, isPending } = useSession();
    const router = useRouter();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const status = isPending ? "loading" : (sessionData?.session ? "authenticated" : "unauthenticated");
    const userRole = (sessionData?.user as any)?.role as UserRole | undefined;
    const isClient = userRole === UserRole.CLIENT;
    
    useEffect(() => {
        if (status === "unauthenticated") {
            setShowLoginModal(true);
        }
    }, [status]);

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newSkill = skillInput.trim();
            if (newSkill && !formData.skills.includes(newSkill)) {
                setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
            }
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status !== "authenticated") {
            setShowLoginModal(true);
            return;
        }
        if (!isClient) {
            setError("Only clients can post jobs.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const skills = formData.skills;
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                budget: Number(formData.budget),
                budgetType: formData.budgetType as "FIXED" | "HOURLY",
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
                skills,
            };

            if (!payload.title || !payload.description || Number.isNaN(payload.budget)) {
                setError("Please fill out all required fields.");
                return;
            }

            const created = await JobsService.create(payload);
            router.push(`/marketplace/jobs/${created.id}`);
        } catch (err) {
            console.error(err);
            setError("Failed to create job. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginRedirect = () => {
        router.push("/auth/login");
    };
    
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-secondary/40 min-h-screen">
            <div className="container mx-auto py-12 px-4">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create a New Job Posting</CardTitle>
                        <CardDescription>Fill out the details below to find the perfect candidate for your project.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        {!isClient && status === "authenticated" && (
                            <div className="mb-4 rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                                Only clients can post jobs. Update your account role to continue.
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <fieldset disabled={status !== "authenticated" || !isClient || isSubmitting} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Senior React Developer"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Job Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the job requirements, responsibilities, and qualifications."
                                        rows={8}
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Budget ($)</Label>
                                        <Input
                                            id="budget"
                                            type="number"
                                            min="0"
                                            placeholder="e.g., 5000"
                                            required
                                            value={formData.budget}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deadline">Deadline (optional)</Label>
                                        <Input
                                            id="deadline"
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Budget Type</Label>
                                    <RadioGroup
                                        defaultValue="FIXED"
                                        className="flex items-center gap-4"
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, budgetType: value }))}
                                        value={formData.budgetType}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="FIXED" id="fixed" />
                                            <Label htmlFor="fixed">Fixed</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="HOURLY" id="hourly" />
                                            <Label htmlFor="hourly">Hourly</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="skills">Required Skills</Label>
                                    <Input
                                        id="skills"
                                        placeholder="Type a skill and press Enter..."
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.skills.map(skill => (
                                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                                {skill}
                                                <X 
                                                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                                                    onClick={() => handleRemoveSkill(skill)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Press enter or comma to add a skill.</p>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? "Posting..." : "Post Job"}
                                    </Button>
                                </div>
                            </fieldset>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Modal open={showLoginModal} onOpenChange={setShowLoginModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Authentication Required</ModalTitle>
                        <ModalDescription>
                            You must be logged in to post a new job. Please log in to continue.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowLoginModal(false)}>Cancel</Button>
                        <Button onClick={handleLoginRedirect}>Log In</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
