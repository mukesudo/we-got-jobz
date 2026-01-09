"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function CreateJobPage() {
    const [jobType, setJobType] = useState("full-time");
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // We'll add form submission logic to the backend later
        alert("Job submitted! (Placeholder)");
    };

    return (
        <div className="bg-secondary/40 min-h-screen">
            <div className="container mx-auto py-12 px-4">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create a New Job Posting</CardTitle>
                        <CardDescription>Fill out the details below to find the perfect candidate for your project.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title</Label>
                                <Input id="title" placeholder="e.g., Senior React Developer" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="web-dev">Web Development</SelectItem>
                                        <SelectItem value="design">Graphic Design</SelectItem>
                                        <SelectItem value="writing">Writing & Translation</SelectItem>
                                        <SelectItem value="marketing">Sales & Marketing</SelectItem>
                                        <SelectItem value="admin">Admin & Customer Support</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Job Description</Label>
                                <Textarea id="description" placeholder="Describe the job requirements, responsibilities, and qualifications." rows={8} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="budget">Budget ($)</Label>
                                    <Input id="budget" type="number" placeholder="e.g., 5000" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" placeholder="e.g., Remote, New York" required />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Job Type</Label>
                                <RadioGroup
                                    defaultValue="full-time"
                                    className="flex items-center gap-4"
                                    onValueChange={setJobType}
                                    value={jobType}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="full-time" id="full-time" />
                                        <Label htmlFor="full-time">Full-time</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="part-time" id="part-time" />
                                        <Label htmlFor="part-time">Part-time</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="contract" id="contract" />
                                        <Label htmlFor="contract">Contract</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="skills">Required Skills</Label>
                                <Input id="skills" placeholder="e.g., React, Node.js, PostgreSQL (comma-separated)" />
                                <p className="text-xs text-muted-foreground">Separate skills with a comma.</p>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" size="lg">Post Job</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
