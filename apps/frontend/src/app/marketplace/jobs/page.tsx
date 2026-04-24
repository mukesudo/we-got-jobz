"use client"

import { useState, useEffect } from 'react';
import JobCard from '@/components/features/job-card';
import { JobsService } from '@/lib/jobs.service';
import { Job } from '@/lib';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Jobs',
  description: 'Find your next freelance opportunity on We Got Jobz. Browse hundreds of remote jobs, contract work, and freelance projects from top companies worldwide.',
  keywords: [
    'browse jobs',
    'freelance jobs',
    'remote jobs',
    'contract work',
    'find work',
    'job listings',
    'freelance opportunities',
    'remote positions',
    'gig economy jobs',
    'part-time remote work'
  ],
  openGraph: {
    title: 'Browse Jobs - Find Your Next Freelance Opportunity',
    description: 'Browse hundreds of remote jobs, contract work, and freelance projects from top companies worldwide. Secure payments and verified clients.',
  },
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await JobsService.getAll();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Job Marketplace
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Find your next freelance opportunity.
          </p>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700">No jobs found</h2>
              <p className="mt-2 text-gray-500">Please check back later.</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
