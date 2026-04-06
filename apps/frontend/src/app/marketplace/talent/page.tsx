"use client"

import { useState, useEffect } from 'react';
import { TalentService } from '@/lib/talent.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TalentPage() {
    const [talent, setTalent] = useState([]);
    const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchTalent = async (searchSkills?: string) => {
        setLoading(true);
        try {
            const data = await TalentService.getAll(searchSkills);
            setTalent(data);
        } catch (error) {
            console.error('Failed to fetch talent:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTalent();
    }, []);

    const handleSearch = () => {
        fetchTalent(skills);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">
                        Browse Freelancers
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Find the perfect freelancer for your project.
                    </p>
                    <div className="mt-4 flex gap-2">
                        <Input 
                            placeholder="Search by skills (e.g., React, Node.js)"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
                </div>
            </header>
            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading talent...</div>
                    ) : talent.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {talent.map((t: any) => (
                                <Card key={t.id}>
                                    <CardHeader>
                                        <CardTitle>{t.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{t.freelancerProfile?.title}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {t.freelancerProfile?.skills.map((skill: any) => (
                                                <Badge key={skill.id}>{skill.name}</Badge>
                                            ))}
                                        </div>
                                        <p className="mt-4 text-lg font-semibold">
                                            ${t.freelancerProfile?.hourlyRate}/hr
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h2 className="text-xl font-semibold text-gray-700">No talent found</h2>
                            <p className="mt-2 text-gray-500">Try adjusting your search.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
