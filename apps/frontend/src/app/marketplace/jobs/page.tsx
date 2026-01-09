'use client';

import React from 'react';
import JobCard from '@/components/features/job-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';

// A simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Moved Job type to module scope
interface Job {
  id: string;
  title: string;
  category?: string;
  description: string;
  budget: number;
  budgetType: string;
  skills?: string[];
  status: string;
  createdAt: string;
}

// Type for the raw job object from the API
interface ApiSkill {
  name: string;
}

interface ApiJob {
  id: string;
  title: string;
  description: string;
  budget: number;
  budgetType: string;
  status: string;
  createdAt: string;
  skills?: ApiSkill[];
  category?: { name: string };
  // any other properties that might exist on the job object from the API
}

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [hasMore, setHasMore] = React.useState(false);
  const PAGE_SIZE = 9;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchJobs = React.useCallback(async (currentPage: number, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('skip', String((currentPage - 1) * PAGE_SIZE));
      params.set('take', String(PAGE_SIZE + 1));
      if (search) params.set('search', search);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (response.ok) {
        const data: ApiJob[] = await response.json();
        const normalized: Job[] = data.map((j) => ({
          ...j,
          category: j.category?.name,
          skills: j.skills?.map((s) => s.name) ?? [],
        }));
        setJobs(normalized.slice(0, PAGE_SIZE));
        setHasMore(normalized.length > PAGE_SIZE);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [PAGE_SIZE]);

  // Effect to reset page number when search term changes.
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  // Single effect to fetch jobs when page or debounced search term changes.
  React.useEffect(() => {
    fetchJobs(page, debouncedSearchTerm);
  }, [page, debouncedSearchTerm, fetchJobs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Available Jobs</h1>
          <p className="mt-2 text-lg text-gray-600">
            Find your next freelance opportunity
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={e => {
              e.preventDefault();
              // The debounced effect will handle fetching.
              // We can optionally trigger it immediately here if desired,
              // but for now we'll let the debounce handle it naturally.
            }}
          >
            <Input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs available at the moment</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <Pagination
              page={page}
              hasMore={hasMore}
              onPrev={() => setPage(p => Math.max(1, p - 1))}
              onNext={() => setPage(p => p + 1)}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}
